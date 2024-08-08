import { PassportStrategy } from '@nestjs/passport';
import { ClientUser, JWTPayload } from 'src/lib/types.';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJWT]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: JWTPayload) {
    const { iat, exp, ...user } = payload;
    return user as ClientUser;
  }
}

function extractJWT(req: Request): string | null {
  if (req.cookies && req.cookies.refreshToken) {
    return req.cookies.refreshToken;
  }
  if (req.headers.authorization) {
    return req.headers.authorization.replace('Bearer ', '');
  }

  if (req.body && req.body.refreshToken) {
    return req.body.refreshToken;
  }
  return null;
}
