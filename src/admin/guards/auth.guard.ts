import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Отсутствует заголовок авторизации');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Некорректный формат токена');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.PRIVATE_KEY || 'DEV',
      });

      // Сохраняем данные пользователя в запросе для дальнейшего использования
      request['user'] = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role, // или любые другие данные из токена
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Токен недействителен или истек');
    }
  }
}
