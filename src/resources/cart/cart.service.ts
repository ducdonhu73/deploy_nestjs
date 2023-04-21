import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument, CartStatus } from './entities/cart.entity';
import { Model } from 'mongoose';
import { AddToCartRequest } from './dto/cart.request.dto';
import { CartResponse } from './dto/cart.response.dto';
import { Product } from 'resources/products/entities/product.entities';
import { User } from 'resources/user/entities/user.entity';
import { mId } from 'utils/helper';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private CartModel: Model<CartDocument>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

  async addProductToCart(u_id: string, request: AddToCartRequest): Promise<CartResponse> {
    const { p_id, quantity } = request;
    const product = await this.ProductModel.findById(p_id);
    const user = await this.UserModel.findById(u_id);

    if (!product) throw new BadRequestException("product doesn't exist");
    if (!user) throw new BadRequestException("user doesn't exist");
    const cart = await this.CartModel.findOne({ $and: [{ p_id }, { u_id }, { status: CartStatus.WAITTING }] });
    let cartResponse;
    if (cart) {
      cartResponse = await cart.updateOne({ $set: { quantity: quantity + cart.quantity } });
    } else {
      cartResponse = await this.CartModel.create({ p_id, u_id, quantity });
    }
    return new CartResponse(cartResponse, user, product);
  }

  async removeProductFromCart(u_id: string, cartId: string): Promise<void> {
    const cart = await this.CartModel.findById(cartId);
    if (cart) {
      await cart.deleteOne();
    } else {
      throw new BadRequestException('cart is not exist');
    }
  }

  async buyProductInCart(listCartId: string[]): Promise<void> {
    const listCart = await this.CartModel.find({ $and: [{ _id: listCartId }, { status: CartStatus.WAITTING }] });
    if (listCart.length === listCartId.length) {
      listCart.map((c) => {
        c.updateOne({ status: CartStatus.BUYED });
      });
    } else throw new BadRequestException('product is no longer in the cart');
  }

  async getCartByUserId(userId: string): Promise<CartResponse[]> {
    const cart = await this.CartModel.aggregate([
      { $match: { $and: [{ u_id: mId(userId) }, { status: CartStatus.WAITTING }] } },
      {
        $lookup: {
          from: 'products',
          localField: 'p_id',
          foreignField: '_id',
          as: 'product',
          pipeline: [
            {
              $project: {
                __v: 0,
              },
            },
          ],
        },
      },
      {
        $unwind: '$product',
      },
    ]);
    const response = cart.map((c) => new CartResponse().constructor2(c as CartResponse));
    return response;
  }
}
