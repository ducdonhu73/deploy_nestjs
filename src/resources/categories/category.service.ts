import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.entities';
import { Model } from 'mongoose';
import { AddCategoryRequest, CategoryResponse, UpdateCategoryRequest } from './category.dto';
import { BadRequestException } from '@nestjs/common';

export class CategoryService {
  constructor(@InjectModel(Category.name) private CategoryModel: Model<Category>) {}

  async allCategory() :Promise<CategoryResponse[]>{
    return this.CategoryModel.find();
  }

  async addCategory(request: AddCategoryRequest): Promise<void> {
    const { category_name, description, image } = request;
    await this.CategoryModel.create({ category_name, description, image });
  }

  async updateCategory(id: string, request: UpdateCategoryRequest): Promise<void> {
    const { category_name, description, image } = request;
    await this.CategoryModel.findByIdAndUpdate(id, { category_name, description, image });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.CategoryModel.findByIdAndDelete(id);
  }

  async getCategoryById(id: string): Promise<CategoryResponse> {
    const category = await this.CategoryModel.findById(id);
    if (!category) {
      throw new BadRequestException('Categry not found');
    }
    return new CategoryResponse(category);
  }
}
