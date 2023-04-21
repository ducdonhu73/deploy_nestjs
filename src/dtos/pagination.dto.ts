/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit: number = 20;
}

class PaginationResponse {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}

export class PaginationDataResponse<T> {
  data: T[];

  @ApiProperty()
  metadata?: PaginationResponse;

  constructor(data: T[], metadata?: { total: number; page: number; limit: number }) {
    this.data = data;
    if (metadata) {
      const { total, limit, page } = metadata;
      this.metadata = {
        total,
        limit,
        page,
        totalPages: Math.round(total / limit),
      };
    }
  }
}
