import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
// import { getAuth } from 'firebase-admin/auth';

// interface UserIdParams {
//   isRequired?: boolean;
// }

export const UserId = createParamDecorator((_, context: ExecutionContext) => {
  const secretKey = process.env['JWT_SECRET'];

  if (!secretKey) {
    throw new UnauthorizedException();
  }

  let token = context.switchToHttp().getRequest<FastifyRequest>().headers['x-auth-token'];
  if (!token) {
    // if (isRequired) {
    //   throw new UnauthorizedException();
    // }
    // return '';
    throw new UnauthorizedException();
  }
  if (typeof token === 'object') {
    token = token[0] as string;
  }

  try {
    const data = jwt.verify(token, secretKey);
    if (typeof data !== 'string') {
      return data['id'] as string;
    } else {
      return '';
    }

    // const auth = getAuth();
    // const decodedToken = await auth.verifyIdToken(token);
    // console.log(decodedToken);
    // return decodedToken.uid;
  } catch (error) {
    throw new UnauthorizedException();
  }
});
