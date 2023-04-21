import { Controller, Get, Body, Put, Delete, Post, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AddCategoryRequest, CategoryResponse, UpdateCategoryRequest } from './category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  allCategory(){
    return this.categoryService.allCategory();
  }

  @Post('add')
  addCategory(@Body() request: AddCategoryRequest): Promise<void> {
    return this.categoryService.addCategory(request);
  }

  @Put('update/:_id')
  updateCategory(@Param('_id') id: string, @Body() request: UpdateCategoryRequest): Promise<void> {
    return this.categoryService.updateCategory(id, request);
  }

  @Delete('delete/:_id')
  deleteCategory(@Param('_id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }

  @Get(':_id')
  getCategoryById(@Param('_id') id: string): Promise<CategoryResponse> {
    return this.categoryService.getCategoryById(id);
  }
}
