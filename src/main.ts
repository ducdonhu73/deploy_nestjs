import compression from '@fastify/compress';
import multipart from '@fastify/multipart';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import jwt_decode from 'jwt-decode';
import morgan from 'morgan';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

import { AppModule } from './app.module';

// import jwt_decode from 'jwt-decode';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  // CORS configured in nginx in production
  if (process.env['NODE_ENV'] !== 'production') {
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Authorization, X-Requested-With, X-Auth-Token',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    });
  }
  await app.register(compression, { encodings: ['gzip', 'deflate'] });
  await app.register(multipart, {
    limits: {
      fileSize: 10000000,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Gear')
    .setDescription('API description of Gear Project')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);

  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('Gear', {
            prettyPrint: true,
            colors: true,
          }),
        ),
        level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
      }),
    ],
  });

  app.useLogger(logger);

  morgan.token('ip', function (req) {
    return (req.headers['x-forwarded-for'] as string) ?? req.socket.remoteAddress;
  });
  morgan.token('user-token', function (req) {
    const token = req.headers['x-auth-token'] as string;
    if (token) {
      const jwt: Record<string, string> = jwt_decode(token);
      return (jwt['user_id'] as string) ?? '-';
    }
    return '-';
  });
  app.use(
    morgan(':ip :user-token :method :url HTTP/:http-version :status :user-agent - :response-time ms', {
      stream: {
        write: function (message) {
          logger.log(message.substring(0, message.lastIndexOf('\n')));
        },
      },
    }),
  );

  // Starts listening for shutdown hooks
  // app.enableShutdownHooks();

  await app.listen(process.env['PORT'] || 8000);
}

void bootstrap();
