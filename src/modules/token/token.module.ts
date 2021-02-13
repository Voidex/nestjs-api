import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { jwtExpiration, jwtSecretKey } from '../auth/jwt.config';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refreshTokens.schema';
import { TokenService } from './token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.register({
      secret: jwtSecretKey,
      signOptions: { expiresIn: jwtExpiration },
    }),
  ],
  providers: [TokenService],
  exports: [TokenService, JwtModule],
})
export class TokenModule {}
