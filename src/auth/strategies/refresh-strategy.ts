import { PassportStrategy } from '@nestjs/passport';
import { ClientUser, JWTPayload } from 'src/lib/types.';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: JWTPayload) {
    const { iat, exp, ...user } = payload;
    return user as ClientUser;
  }
}
