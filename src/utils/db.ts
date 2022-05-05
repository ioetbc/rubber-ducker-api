import { Pool } from "pg";
import { TechnologyFilter } from "src/types";

const pool = new Pool({
  connectionString: process.env.POSTGRES_DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // port: 5432,
  // database: "rubber-ducker",
  // host: "localhost",
});

export const updateUser = async ({
  body,
  github_id,
}: {
  body: any;
  github_id: string;
}) => {
  return pool.connect().then(async (client) => {
    const {
      username,
      bio,
      phone_number,
      email_marketing_consent,
      text_message_consent,
      teacher,
      stripe_client_id,
      has_completed_onboarding,
      per_hour_rate,
      javascript,
      html,
      css,
      node,
      python,
      react,
      svelte,
      postgres,
      dynamo_db,
      tensorflow,
    } = body;

    return client
      .query(
        `
        UPDATE user_metadata
        SET
          username = $1,
          bio = $2,
          phone_number = $3,
          email_marketing_consent = $4,
          text_message_consent = $5,
          teacher = $6,
          stripe_client_id = $7,
          has_completed_onboarding = $8,
          per_hour_rate = $9
        WHERE github_id = $10
      `,
        [
          username,
          bio,
          phone_number,
          email_marketing_consent,
          text_message_consent,
          teacher,
          stripe_client_id,
          has_completed_onboarding,
          per_hour_rate,
          github_id,
        ]
      )
      .then(() => {
        client.query(
          `
          UPDATE technologies
          SET
            javascript = $1,
            html = $2,
            css = $3,
            node = $4,
            python = $5,
            react = $6,
            svelte = $7,
            postgres = $8,
            dynamo_db = $9,
            tensorflow = $10
          WHERE github_id = $11
        `,
          [
            javascript,
            html,
            css,
            node,
            python,
            react,
            svelte,
            postgres,
            dynamo_db,
            tensorflow,
            github_id,
          ]
        );
        // client.release();
      });
  });
};

export const findUser = async ({ github_id }: { github_id: string }) => {
  return pool
    .connect()
    .then(async (client) => {
      return client
        .query("SELECT * FROM user_metadata WHERE github_id = $1;", [github_id])
        .then((result: any) => {
          return result.rows[0];
        })
        .then(async (userMetaData) => {
          const tech = await client.query(
            "SELECT * FROM technologies WHERE github_id = $1;",
            [github_id]
          );
          client.release();

          return { ...userMetaData, ...tech.rows[0] };
        });
    })
    .catch((e: any) => console.log(e));
};

export const findConversation = async ({
  github_id,
  teacher_github_id,
}: {
  github_id: string;
  teacher_github_id: string;
}) => {
  console.log({ github_id, teacher_github_id });
  return pool
    .connect()
    .then(async (client) => {
      return client
        .query(
          `SELECT * FROM messages
          LEFT JOIN user_metadata ON messages.github_id = user_metadata.github_id
          WHERE messages.github_id = $1 OR recipient = $1 AND messages.github_id = $2 OR recipient = $2`,
          [github_id, teacher_github_id]
        )
        .then((result: any) => {
          client.release();
          return result.rows;
        });
    })
    .catch((e: any) => console.log(e));
};

export const createMessage = async ({
  github_id,
  teacher_github_id,
  text,
}: {
  github_id: string;
  teacher_github_id: string;
  text: string;
}) => {
  console.log({ github_id, teacher_github_id });
  return pool
    .connect()
    .then(async (client) => {
      return client
        .query("INSERT INTO messages VALUES ($1, $2, $3)", [
          github_id,
          text,
          teacher_github_id,
        ])
        .then((result: any) => {
          client.release();
          return result.rows;
        });
    })
    .catch((e: any) => console.log(e));
};

export const findAllMessages = async ({ github_id }: { github_id: string }) => {
  return pool
    .connect()
    .then(async (client) => {
      return client
        .query(
          `with msgs as (
              SELECT
                case when github_id = $1 then recipient
                else github_id end as teacher_github_id,
                text,
                created_at
              FROM messages WHERE github_id = $1 OR recipient = $1
              ),
              rnked as (
              select
                teacher_github_id,
                row_number() over (partition by teacher_github_id order by created_at desc) as rnk,
                text,
                created_at,
                *
              from msgs
              LEFT JOIN user_metadata ON teacher_github_id = user_metadata.github_id
              )
              select * from rnked where rnk = 1`,
          [github_id]
        )
        .then(async (result: any) => {
          client.release();
          console.log("messages", result.rows);
          return result.rows;
        });
    })
    .catch((e: any) => console.log(e));
};

export const reviews = async ({ github_id }: { github_id: string }) => {
  return pool
    .connect()
    .then(async (client) => {
      return client
        .query(
          `
            SELECT *
            FROM reviews
            WHERE github_id = $1
          `,
          [github_id]
        )
        .then(
          (
            result: any
          ): {
            github_id: string;
            reviews: string[];
            averageStarRating: number;
          } => {
            client.release();
            type Type = { review: string; stars: number };
            const reviews = result.rows.map((result: Type) => result.review);

            if (!reviews.length) {
              return { github_id, reviews, averageStarRating: 3 };
            }
            const averageStarRating = (
              result.rows
                .map((row: Type) => row.stars)
                .reduce(
                  (prevValue: number, currentValue: number) =>
                    prevValue + currentValue,
                  0
                ) / result.rows.length
            ).toFixed(0);

            return {
              github_id,
              reviews,
              averageStarRating: Number(averageStarRating),
            };
          }
        );
    })
    .catch((e: any) => {
      throw new Error(e);
    });
};

export const findTeachers = async ({
  minStarRating,
  technologies,
  maxTeacherPrice,
}: {
  github_id: string;
  minStarRating: number;
  technologies: TechnologyFilter[];
  maxTeacherPrice: number;
}) => {
  return pool
    .connect()
    .then(async (client) => {
      return client
        .query(
          `
            SELECT * FROM technologies
            LEFT JOIN user_metadata ON technologies.github_id = user_metadata.github_id
            WHERE ${technologies.map(
              (technology: { type: string; proficency: number }) =>
                `${technology.type} >= ${technology.proficency}`
            )}`.replaceAll(",", " AND ")
        )
        .then(async (result: any) => {
          const filterByPrice = result.rows.filter((user: any) => {
            return Number(user.per_hour_rate) <= Number(maxTeacherPrice);
          });

          const reviewResults = await Promise.all(
            filterByPrice.map((user: any) => {
              return reviews({ github_id: user.github_id });
            })
          );

          const filterByRatings = reviewResults.filter(
            (user) => Number(user.averageStarRating) >= Number(minStarRating)
          );

          const allUserData = await Promise.all(
            filterByRatings.map((user: any) => {
              return findUser({ github_id: user.github_id });
            })
          );

          return allUserData;
        });
    })
    .catch((e: any) => console.log(e));
};

export const findAllUsers = async () => {
  return pool
    .connect()
    .then(async (client) => {
      return client
        .query(
          "select * from user_metadata left join technologies on user_metadata.github_id = technologies.github_id"
        )
        .then((result: any) => {
          client.release();
          return result.rows;
        });
    })
    .catch((e: any) => console.log(e));
};

export const createUser = async ({
  username,
  avatar_url,
  github_id,
}: {
  username: string;
  avatar_url: string;
  github_id: string;
}) => {
  return pool
    .connect()
    .then(async (client) => {
      return client
        .query(
          "INSERT INTO user_metadata VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
          [
            github_id,
            username,
            avatar_url,
            "",
            "",
            false,
            false,
            false,
            "",
            null,
            false,
            100,
          ]
        )
        .then(() => {
          client.query(
            "INSERT INTO technologies VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [github_id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          );
          client.release();
        });
    })
    .catch((e: any) => console.error("error creating user", e));
};

export const createReview = async ({
  review,
  stars,
  teacher_id,
}: {
  review: string;
  stars: number;
  teacher_id: string;
}) => {
  console.log({
    review,
    stars,
    teacher_id,
  });
  return pool
    .connect()
    .then(async (client) => {
      return client
        .query("INSERT INTO reviews VALUES ($1, $2, $3)", [
          teacher_id,
          review,
          stars,
        ])
        .then(async () => {
          const allReviews = await reviews({ github_id: teacher_id });
          console.log("allReviews", allReviews);
          client.release();
          return allReviews;
        });
    })
    .catch((e: any) => console.error("error creating user", e));
};
