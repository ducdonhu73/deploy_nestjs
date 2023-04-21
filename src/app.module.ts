import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ExceptionFormatter, ResponseFormatter } from 'interceptors/response.interceptor';
import mongoose from 'mongoose';
import { UserModule } from './resources/user/user.module';
import { ProductModule } from './resources/products/product.module';
import { FirebaseModule } from './services/firebase/firebase.module';
import { S3Module } from 'resources/s3/s3.module';
import { CartModule } from 'resources/cart/cart.module';
import { CategoryModule } from 'resources/categories/category.module';
import { RolesGuard } from 'guards/roles.guard';
import { OrdertModule } from 'resources/order/order.module';
import { HistoryModule } from 'resources/history/history.module';

mongoose.set('debug', true);

@Module({
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
    { provide: APP_INTERCEPTOR, useClass: ResponseFormatter },
    { provide: APP_FILTER, useClass: ExceptionFormatter },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env['MONGODB_URL'] || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ScheduleModule.forRoot(),
    FirebaseModule.forRoot(),
    UserModule,
    ProductModule,
    CategoryModule,
    S3Module,
    CartModule,
    OrdertModule,
    HistoryModule,
  ],
})
export class AppModule {}
