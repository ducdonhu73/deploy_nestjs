import { Controller, Get, Body, Put, Delete, Post, Param, Query } from '@nestjs/common';
import { AddProductRequest, GetAllProductQuery, ProductResponse, UpdateProductRequest } from '../dto/product.dto';
import { ProductService } from '../service/product.service';
import { Roles } from 'decorators/roles.decorator';
import { Role } from 'constants/roles';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  allProduct(@Query() query: GetAllProductQuery) {
    return this.productService.allProduct(query);
  }

  @Roles(Role.ADMIN)
  @Post('add')
  addProduct(@Body() request: AddProductRequest) {
    return this.productService.addProduct(request);
  }

  @Roles(Role.ADMIN)
  @Put('update/:_id')
  updateProduct(@Param('_id') id: string, @Body() request: UpdateProductRequest) {
    return this.productService.updateProduct(id, request);
  }

  @Roles(Role.ADMIN)
  @Delete('delete/:_id')
  deleteProduct(@Param('_id') id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }

  @Get(':_id')
  getProductById(@Param('_id') id: string): Promise<ProductResponse> {
    return this.productService.getProductById(id);
  }
}
