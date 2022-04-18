"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.createUser = exports.findAllUsers = exports.findTeachers = exports.reviews = exports.findAllMessages = exports.findConversation = exports.findUser = exports.updateUser = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.POSTGRES_DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
const updateUser = async ({ body, github_id, }) => {
    return pool.connect().then(async (client) => {
        const { username, bio, phone_number, email_marketing_consent, text_message_consent, teacher, stripe_client_id, has_completed_onboarding, per_hour_rate, javascript, html, css, node, python, react, svelte, postgres, dynamo_db, tensorflow, } = body;
        return client
            .query(`
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
      `, [
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
        ])
            .then(() => {
            client.query(`
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
        `, [
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
            ]);
        });
    });
};
exports.updateUser = updateUser;
const findUser = async ({ github_id }) => {
    return pool
        .connect()
        .then(async (client) => {
        return client
            .query("SELECT * FROM user_metadata WHERE github_id = $1;", [github_id])
            .then((result) => {
            return result.rows[0];
        })
            .then(async (userMetaData) => {
            const tech = await client.query("SELECT * FROM technologies WHERE github_id = $1;", [github_id]);
            client.release();
            return { ...userMetaData, ...tech.rows[0] };
        });
    })
        .catch((e) => console.log(e));
};
exports.findUser = findUser;
const findConversation = async ({ github_id, recipient_github_id, }) => {
    return pool
        .connect()
        .then(async (client) => {
        return client
            .query("SELECT * FROM messages WHERE github_id = $1 OR recipient = $1 AND github_id = $2 OR recipient = $2", [github_id, recipient_github_id])
            .then((result) => {
            client.release();
            return result.rows[0];
        });
    })
        .catch((e) => console.log(e));
};
exports.findConversation = findConversation;
const findAllMessages = async ({ github_id }) => {
    return pool
        .connect()
        .then(async (client) => {
        return (client
            .query(`SELECT * FROM messages
            WHERE github_id = $1 OR recipient = $1
            ORDER BY created_at DESC`, [github_id])
            .then(async (result) => {
            client.release();
            console.log("returning these messges", result.rows);
            return result.rows;
        }));
    })
        .catch((e) => console.log(e));
};
exports.findAllMessages = findAllMessages;
const reviews = async ({ github_id }) => {
    return pool
        .connect()
        .then(async (client) => {
        return client
            .query(`
            SELECT *
            FROM reviews
            WHERE github_id = $1
          `, [github_id])
            .then((result) => {
            client.release();
            const reviews = result.rows.map((result) => result.review);
            if (!reviews.length) {
                return { github_id, reviews, averageStarRating: 3 };
            }
            const averageStarRating = (result.rows
                .map((row) => row.stars)
                .reduce((prevValue, currentValue) => prevValue + currentValue, 0) / result.rows.length).toFixed(0);
            return {
                github_id,
                reviews,
                averageStarRating: Number(averageStarRating),
            };
        });
    })
        .catch((e) => {
        throw new Error(e);
    });
};
exports.reviews = reviews;
const findTeachers = async ({ minStarRating, technologies, maxTeacherPrice, }) => {
    return pool
        .connect()
        .then(async (client) => {
        return client
            .query(`
            SELECT * FROM technologies
            LEFT JOIN user_metadata ON technologies.github_id = user_metadata.github_id
            WHERE ${technologies.map((technology) => `${technology.type} >= ${technology.proficency}`)}`.replaceAll(",", " AND "))
            .then(async (result) => {
            const filterByPrice = result.rows.filter((user) => {
                return Number(user.per_hour_rate) <= Number(maxTeacherPrice);
            });
            const reviewResults = await Promise.all(filterByPrice.map((user) => {
                return (0, exports.reviews)({ github_id: user.github_id });
            }));
            const filterByRatings = reviewResults.filter((user) => Number(user.averageStarRating) >= Number(minStarRating));
            const allUserData = await Promise.all(filterByRatings.map((user) => {
                return (0, exports.findUser)({ github_id: user.github_id });
            }));
            return allUserData;
        });
    })
        .catch((e) => console.log(e));
};
exports.findTeachers = findTeachers;
const findAllUsers = async () => {
    return pool
        .connect()
        .then(async (client) => {
        return client
            .query("select * from user_metadata left join technologies on user_metadata.github_id = technologies.github_id")
            .then((result) => {
            client.release();
            return result.rows;
        });
    })
        .catch((e) => console.log(e));
};
exports.findAllUsers = findAllUsers;
const createUser = async ({ username, avatar_url, github_id, }) => {
    return pool
        .connect()
        .then(async (client) => {
        return client
            .query("INSERT INTO user_metadata VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [
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
        ])
            .then(() => {
            client.query("INSERT INTO technologies VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [github_id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            client.release();
        });
    })
        .catch((e) => console.error("error creating user", e));
};
exports.createUser = createUser;
const createReview = async ({ review, stars, teacher_id, }) => {
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
            const allReviews = await (0, exports.reviews)({ github_id: teacher_id });
            console.log("allReviews", allReviews);
            client.release();
            return allReviews;
        });
    })
        .catch((e) => console.error("error creating user", e));
};
exports.createReview = createReview;
//# sourceMappingURL=db.js.map