import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { JwtStrategy, STRATEGY_JWT } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    TokenModule,
    PassportModule.register({ defaultStrategy: STRATEGY_JWT }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
