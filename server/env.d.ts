declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Server Configuration
      PORT?: string;
      HOST?: string;
      NODE_ENV?: "development" | "production";
      ALLOWED_ORIGIN?: string;

      // Salesforce Configuration
      SALESFORCE_BASE_URL: string;
      SALESFORCE_ORG_ID: string;
      SALESFORCE_DEVELOPER_NAME: string;
    }
  }
}

export {};
