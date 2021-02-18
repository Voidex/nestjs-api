import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAccessPayload, jwtSecretKey, jwtExpiration } from './jwt.config';

export const STRATEGY_JWT = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, STRATEGY_JWT) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecretKey,
      signOptions: {
        expiresIn: jwtExpiration,
      },
    });
  }

  async validate(payload: JwtAccessPayload) {
    return this.authService.getUserFromJwtPayload(payload);
  }
}
