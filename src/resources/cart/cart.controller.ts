import { Body, Controller, Post, Get, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartRequest, BuyProductRequest, RemoveFromCartRequest } from './dto/cart.request.dto';
import { UserId } from 'decorators/auth.decorator';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  addToCart(@UserId() userId: string, @Body() request: AddToCartRequest) {
    return this.cartService.addProductToCart(userId, request);
  }

  @Delete('remove')
  removeCart(@UserId() userId: string, @Body() request: RemoveFromCartRequest) {
    return this.cartService.removeProductFromCart(userId, request.cartId);
  }

  @Get()
  getCartByUserId(@UserId() id: string) {
    return this.cartService.getCartByUserId(id);
  }

  @Post('buy')
  buyProductInCart(@Body() request: BuyProductRequest) {
    return this.cartService.buyProductInCart(request.listCartId);
  }
}
