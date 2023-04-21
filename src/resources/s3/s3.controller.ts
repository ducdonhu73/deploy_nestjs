import { Controller, Post, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UploadResponse } from './dto/s3.dto';
import { S3Service } from './s3.services';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}
  @Post('upload')
  upload(@Req() req: FastifyRequest): Promise<UploadResponse[]> {
    return this.s3Service.upload(req);
  }
}
