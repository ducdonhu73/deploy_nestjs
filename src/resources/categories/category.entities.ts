import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QueryFilter } from 'resources/user/dto/user.dto';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  category_name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export class GetCategoryQuery extends QueryFilter {}
