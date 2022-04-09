export type User = {
  avatar_url: string;
  bio: string;
  crypto_wallet_address: string;
  email_marketing_consent: string;
  github_id: string;
  phone_number: string;
  stripe_client_id: string;
  teacher: string;
  text_message_consent: string;
  username: string;
  has_completed_onboarding: string;
  per_hour_rate: string;
  html: number;
  javascript: number;
  node: number;
  postgres: number;
  python: number;
  react: number;
  svelte: number;
  tensorflow: number;
  css: number;
  dynamo_db: number;
};

export type Page = "profile" | "contact" | "homepage" | "teacher";

export type TechnologyFilter = {
  type: TechnologyTypes;
  proficency: ProficiencyTypes;
};

export type TeacherFilters = {
  minStarRating: number;
  technologies: TechnologyFilter[];
};

export type TechnologyTypes =
  | "javascript"
  | "html"
  | "css"
  | "node"
  | "python"
  | "react"
  | "svelte"
  | "postgres"
  | "dynamo_db"
  | "tensorflow";

export type ProficiencyTypes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
