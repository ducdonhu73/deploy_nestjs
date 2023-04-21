import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadResponse } from './dto/s3.dto';
import { FastifyRequest } from 'fastify';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  async upload(req: FastifyRequest): Promise<UploadResponse[]> {
    if (!req.isMultipart) {
      throw new BadRequestException('Request is not multipart');
    }
    const files = req.files();
    const s3Client = new S3Client({
      region: process.env['AWS_REGION'] ?? '',
      credentials: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'] ?? '',
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] ?? '',
      },
    });

    const response: UploadResponse[] = [];
    for await (const file of files) {
      const buffer = await file.toBuffer();
      const key = file.filename;
      // TODO: move to a new service
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env['AWS_PUBLIC_BUCKET_NAME'] ?? '',
          Key: key,
          ACL: 'public-read',
          Body: buffer,
          ContentType: file.mimetype,
        }),
      );
      const path = `https://ws-test-ddn.s3.amazonaws.com/${key}`;
      response.push({
        link: path,
      });
    }
    return response;
  }
}
