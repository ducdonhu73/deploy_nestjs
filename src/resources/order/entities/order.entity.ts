import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as mongooseSchema } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILD = 'faild',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: mongooseSchema.Types.ObjectId, ref: 'product' })
  p_id: Types.ObjectId;

  @Prop({ required: true, type: mongooseSchema.Types.ObjectId, ref: 'user' })
  u_id: Types.ObjectId;

  @Prop()
  total: number;

  @Prop({ default: OrderStatus.PENDING, enum: OrderStatus, required: true })
  status: OrderStatus;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}
export type OrderDocument = Order & Document;

export const OrderSchema = SchemaFactory.createForClass(Order);
