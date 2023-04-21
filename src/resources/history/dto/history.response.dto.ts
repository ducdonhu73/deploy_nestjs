import { ProductResponse } from 'resources/products/dto/product.dto';
import { UserResponse } from 'resources/user/dto/user.dto';

export class HistoryResponse {
  product: ProductResponse;
  user: UserResponse;
  total: number;
  date: Date;
  quantity: number;
}
