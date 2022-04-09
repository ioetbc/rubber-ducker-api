declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      GITHUB_CALLBACK_URL: string;
      JWT_SECRET: string;
    }
  }
}

export {};
