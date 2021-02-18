import dotenv from 'dotenv';

dotenv.config();

export interface JwtAccessPayload {
  sub: string;
}

export interface JwtRefreshPayload {
  jti: string;
  sub: string;
}

export const jwtSecretKey = process.env.JWT_SECRET;

if (!jwtSecretKey) {
  throw new Error('JWT_SECRET is not found in the environment');
}

console.log(typeof +process.env.JWT_ACCESS_TOKEN_EXPIRATION);

export const jwtExpiration = +process.env.JWT_ACCESS_TOKEN_EXPIRATION || 60;
