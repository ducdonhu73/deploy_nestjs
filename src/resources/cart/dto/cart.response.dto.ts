import { UserResponse } from 'resources/user/dto/user.dto';
import { ProductResponse } from 'resources/products/dto/product.dto';
import { CartDocument } from '../entities/cart.entity';
import { UserDocument } from 'resources/user/entities/user.entity';
import { ProductDocument } from 'resources/products/entities/product.entities';

export class CartResponse {
  _id: string;
  user: UserResponse;
  product: ProductResponse;
  quantity: number;

  constructor(cart?: CartDocument, user?: UserDocument, product?: ProductDocument) {
    if (user) this.user = new UserResponse(user);
    if (product) this.product = new ProductResponse(product);
    if (cart) {
      this.quantity = cart.quantity;
      this._id = cart.id;
    }
  }

  constructor2(cart: CartResponse) {
    this.user = cart.user;
    this.quantity = cart.quantity;
    this.product = cart.product;
    this._id = cart._id;
    return this;
  }
}
