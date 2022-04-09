// const scratch = (body) => {
//   // where javascript >= proficency && postgres >= proficency
//   const query = `select * from functionality_table where ${body.map(
//     (technology) => `${technology.language} >= ${technology.proficency}`
//   )}`.replace(",", " AND ");

//   console.log("query", query);
// };

// scratch([
//   { language: "javascript", proficency: 10 },
//   { language: "postgres", proficency: 6 },
// ]);

const scratch = (body, github_id) => {
  const hmm = Object.values(body);
  const subs = [...hmm, github_id];

  console.log("subs", subs);
};

scratch(
  {
    bio: "qdqdqd",
    crypto_wallet_address: "wodjwdowdowdk",
    email_marketing_consent: "true",
    has_completed_onboarding: "true",
    phone_number: "2424",
    stripe_client_id: "1234",
    teacher: "true",
    text_message_consent: "true",
    username: "sqsqsqsioetbc",
  },
  "github_id"
);
