import dotenv from 'dotenv';
dotenv.config();

const user: string = process.env.DB_USER;
const password: string = process.env.DB_PASSWORD;
const host: string = process.env.DB_HOST;
const port: string = process.env.DB_PORT;
const databaseName: string = process.env.DB_NAME;

if (!user) {
  throw new Error('DB_USER param is not provided in .env file');
}

if (!password) {
  throw new Error('DB_PASSWORD param is not provided in .env file');
}

if (!host) {
  throw new Error('DB_HOST param is not provided in .env file');
}

if (!port) {
  throw new Error('DB_PORT param is not provided in .env file');
}

if (!databaseName) {
  throw new Error('DB_NAME param is not provided in .env file');
}

export const initialConfig: string = `mongodb://${user}:${password}@${host}:${port}/?authSource=${databaseName}`;
