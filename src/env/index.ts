import "dotenv/config";

export const env = {
  PORT: process.env.PORT || 3000,
  SECRET: process.env.SECRET!,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
};
