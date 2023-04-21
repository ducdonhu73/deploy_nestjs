import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../entities/product.entities';
import { FilterQuery, Model } from 'mongoose';
import { AddProductRequest, GetAllProductQuery, ProductResponse, UpdateProductRequest } from '../dto/product.dto';
import { BadRequestException } from '@nestjs/common';
import { Category, CategoryDocument } from 'resources/categories/category.entities';
import { mId } from 'utils/helper';

export class ProductService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(Category.name) private CategoryModel: Model<CategoryDocument>,
  ) {}

  async allProduct(query: GetAllProductQuery): Promise<ProductResponse[]> {
    const { category, product_name, limit, page } = query;
    const filter: FilterQuery<ProductDocument> = {};
    if (category) {
      filter.category_id = mId(category);
    }
    if (product_name) {
      filter.product_name = { $regex: product_name };
    }
    return this.ProductModel.find(filter);
  }

  async addProduct(request: AddProductRequest): Promise<ProductResponse> {
    const { category_name, product_name, amount, price, description, image, ngaysx, hsd, nhasx } = request;
    const category = await this.CategoryModel.findOne({ category_name });
    if (!category) throw new BadRequestException('category is not exist');
    const product = await this.ProductModel.create({
      category_id: category.id,
      product_name,
      amount,
      price,
      description,
      image,
      ngaysx,
      hsd,
      nhasx,
    });
    return new ProductResponse(product);
  }

  async updateProduct(productId: string, updateProductRequest: UpdateProductRequest): Promise<ProductResponse> {
    const { category_name, product_name, amount, price, description, image, ngaysx, hsd, nhasx } = updateProductRequest;
    const category = await this.CategoryModel.findOne({ category_name });
    if (!category) {
      throw new BadRequestException('Category is not exist');
    }
    const product = await this.ProductModel.findByIdAndUpdate(productId, {
      category_id: category.id,
      product_name,
      amount,
      price,
      description,
      image,
      ngaysx,
      hsd,
      nhasx,
    });
    if (!product) {
      throw new BadRequestException('product is not exist');
    }
    return new ProductResponse(product);
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.ProductModel.findByIdAndDelete(productId);
  }

  async getProductById(productId: string): Promise<ProductResponse> {
    const product = await this.ProductModel.findById(productId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const cate = await this.CategoryModel.findById(product.category_id);
    if (!cate) {
      throw new BadRequestException('not found category of product');
    }
    return new ProductResponse(product, cate);
  }
}
