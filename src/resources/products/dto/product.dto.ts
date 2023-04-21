import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductDocument } from '../entities/product.entities';
import { Types } from 'mongoose';
import { CategoryDocument } from 'resources/categories/category.entities';
import { PaginationQuery } from 'dtos/pagination.dto';

export class AddProductRequest {
  @IsNotEmpty()
  category_name: string;

  @IsNotEmpty()
  product_name: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  price: number;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  ngaysx: Date;

  @IsNotEmpty()
  hsd: Date;

  @IsNotEmpty()
  nhasx: string;
}

export class AddProductResponse {
  @IsNotEmpty()
  success: boolean;

  constructor(success: boolean) {
    this.success = success;
  }
}

export class UpdateProductRequest {
  @IsNotEmpty()
  @IsString()
  category_name: string;

  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsDateString()
  ngaysx: Date;

  @IsNotEmpty()
  @IsDateString()
  hsd: Date;

  @IsNotEmpty()
  @IsString()
  nhasx: string;
}

// export class DeleteProductRequest{
//   @IsNotEmpty()
//   id:string
// }

export class GetAllProductQuery extends PaginationQuery {
  @IsOptional()
  category: string;

  @IsOptional()
  product_name: string;
}

export class ProductResponse {
  _id: string;
  category_id: Types.ObjectId;
  category_name: string;
  product_name: string;
  amount: number;
  price: number;
  description?: string;
  image?: string;
  ngaysx: Date;
  hsd: Date;
  nhasx: string;
  updatedAt: Date;
  createdAt: Date;

  constructor(product: ProductDocument, category?: CategoryDocument) {
    this._id = product.id as string;
    if (category) this.category_name = category.category_name;
    else this.category_id = product.category_id;
    this.product_name = product.product_name;
    this.amount = product.amount;
    this.price = product.price;
    if (product.description) {
      this.description = product.description;
    }
    if (product.image) {
      this.image = product.image;
    }
    this.ngaysx = product.ngaysx;
    this.hsd = product.hsd;
    this.nhasx = product.nhasx;
    this.updatedAt = product.updatedAt;
    this.createdAt = product.createdAt;
  }
}
