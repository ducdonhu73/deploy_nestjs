import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as mongooseSchema } from 'mongoose';

export enum CartStatus {
  WAITTING = 'waitting',
  BUYED = 'buyed',
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, type: mongooseSchema.Types.ObjectId, ref: 'product' })
  p_id: Types.ObjectId;

  @Prop({ required: true, type: mongooseSchema.Types.ObjectId, ref: 'user' })
  u_id: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  total: number;

  @Prop({ default: CartStatus.WAITTING, enum: CartStatus, required: true })
  status: CartStatus;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}
export type CartDocument = Cart & Document;

export const CartSchema = SchemaFactory.createForClass(Cart);
