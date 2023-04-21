import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class AddToCartRequest {
  p_id: string;
  quantity: number;
}

export class RemoveFromCartRequest {
  cartId: string;
}

export class BuyProductRequest {
  @IsNotEmpty()
  @IsArray()
  @Transform(({ value }: { value: string }) => value.split(',').map((item) => item.trim()))
  listCartId: string[];
}
