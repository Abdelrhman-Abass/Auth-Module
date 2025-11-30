import dotenv from "dotenv";
dotenv.config();

if (!process.env['JWT_ACCESS_SECRET']) {
  throw new Error(" Missing environment variable: JWT_SECRET");
}

if (!process.env['JWT_REFRESH_SECRET']) {
  throw new Error(" Missing environment variable: JWT_REFRESH_TOKEN");
}

export const config = {
  JWT_ACCESS_SECRET: process.env['JWT_ACCESS_SECRET']!,
  ACCESS_TOKEN_EXPIRES_IN: "60m",

  JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET']!,
  REFRESH_TOKEN_EXPIRES_IN: "30d",

  GOOGLE_CLIENT_ID: process.env['GOOGLE_CLIENT_ID']!,
  GOOGLE_CLIENT_SECRET: process.env['GOOGLE_CLIENT_SECRET']!,

  FRONTEND_URL: process.env['FRONTEND_URL']!,
  BACKEND_URL: process.env['BACKEND_URL']!,
};
