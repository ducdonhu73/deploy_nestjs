import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as mongooseSchema } from 'mongoose';
import { QueryFilter } from 'resources/user/dto/user.dto';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, type: mongooseSchema.Types.ObjectId, ref: 'category' })
  category_id: Types.ObjectId;

  @Prop({ required: true })
  product_name: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  ngaysx: Date;

  @Prop({ required: true })
  hsd: Date;

  @Prop({ required: true })
  nhasx: string;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export class GetProductQuery extends QueryFilter {}
