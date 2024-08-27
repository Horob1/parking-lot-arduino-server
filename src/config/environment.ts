import dotenv from 'dotenv'
dotenv.config()

export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  SENDER_EMAIL: process.env.SENDER_EMAIL
} as const
