import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'resources/products/entities/product.entities';
import { User } from 'resources/user/entities/user.entity';
import { mId } from 'utils/helper';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

  async approveOrder(orderId: string): Promise<void> {
    const order = this.OrderModel.findById(orderId);
    if (!order) {
      throw new BadRequestException('Order is not existed');
    }
    order.updateOne({ status: OrderStatus.SUCCESS });
  }

  async rejectOrder(orderId: string): Promise<void> {
    const order = this.OrderModel.findById(orderId);
    if (!order) {
      throw new BadRequestException('Order is not existed');
    }
    order.updateOne({ status: OrderStatus.FAILD });
  }
}
