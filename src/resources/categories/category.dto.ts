import { IsNotEmpty, IsOptional } from 'class-validator';
import { CategoryDocument } from './category.entities';

export class AddCategoryRequest {
  @IsNotEmpty()
  category_name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  image: string;
}

export class UpdateCategoryRequest {
  @IsOptional()
  category_name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  image: string;
}

export class CategoryResponse {
  id: string;
  category_name: string;
  description?: string;
  image?: string;
  updatedAt: Date;
  createdAt: Date;

  constructor(category: CategoryDocument) {
    this.id = category.id as string;
    this.category_name = category.category_name;
    if (category.description) {
      this.description = category.description;
    }
    if (category.image) {
      this.image = category.image;
    }
    this.updatedAt = category.updatedAt;
    this.createdAt = category.createdAt;
  }
}
