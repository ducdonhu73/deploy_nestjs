import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Role } from 'constant';
import { FastifyRequest } from 'fastify';
import { verify } from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    let token = context.switchToHttp().getRequest<FastifyRequest>().headers['x-auth-token'];

    if (!token) {
      throw new UnauthorizedException();
    }
    if (typeof token === 'object') {
      token = token[0] as string;
    }

    const secretKey = process.env['JWT_SECRET'];
    if (!secretKey) {
      throw new UnauthorizedException();
    }

    const data = verify(token, secretKey);

    if (typeof data === 'string') {
      throw new UnauthorizedException();
    }

    if (roles.every((role) => role !== data['role'])) {
      throw new ForbiddenException();
    }

    // if (roles.some((role) => role === Role.ITG) && data['role'] === Role.ITG) {
    //     return true;
    // } else if (roles.some((role) => role === Role.DRIVER) && data['role'] === Role.DRIVER) {
    //     await this.authService.authenticateDriver(data['id'] as string);
    // } else {
    //     await this.authService.authenticate(data['id'] as string);
    // }

    return true;
  }
}
