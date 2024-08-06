import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ClientUser, JWTPayload } from 'src/lib/types.';
import { Request } from 'express';
import { env } from '../../../env';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
      ignoreExpiration: true,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: JWTPayload) {
    const { iat, exp, ...user } = payload;
    return user as ClientUser;
  }
}
function extractJwtFromCookie(req: Request): string | null {
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }
  if (req.headers.authorization) {
    return req.headers.authorization.replace('Bearer ', '');
  }
  return null;
}
