import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'resources/order/entities/order.entity';
import { Product } from 'resources/products/entities/product.entities';
import { User } from 'resources/user/entities/user.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}
  async getAllHistories(): Promise<any> {
    const orders = await this.OrderModel.find();
    return orders;
  }
}
