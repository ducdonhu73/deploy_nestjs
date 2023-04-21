import { IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { UserDocument } from '../entities/user.entity';
import { PaginationQuery } from 'dtos/pagination.dto';
import { Type } from 'class-transformer';
import { Role } from 'constants/roles';

export class QueryFilter extends PaginationQuery {
  search?: string;

  @Type(() => Date)
  startDate?: Date;

  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderBy?: number;
}

export class CreateUserRequest {
  @IsNotEmpty()
  @Length(1, 255)
  firstName: string;

  @IsNotEmpty()
  @Length(1, 255)
  lastName: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @Length(1, 255)
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}

export class UpdateUserRequest {
  @IsOptional()
  @Length(0, 255)
  firstName?: string;

  @IsOptional()
  @Length(0, 255)
  lastName?: string;

  @IsOptional()
  @Length(0, 255)
  email?: string;
}

export class DeleteUserRequest {
  @IsNotEmpty()
  password: string;
}

export class UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  updatedAt: Date;
  createdAt: Date;
  role: Role;

  constructor(user: UserDocument) {
    this.id = user.id as string;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    if (user.phoneNumber) this.phoneNumber = user.phoneNumber;
    if (user.email) {
      this.email = user.email;
    }
    this.updatedAt = user.updatedAt;
    this.createdAt = user.createdAt;
    this.role = user.role;
  }
}

export class RegisterUserRequest {
  @IsNotEmpty()
  @Length(1, 255)
  firstName: string;

  @IsNotEmpty()
  @Length(1, 255)
  lastName: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  @Length(1, 255)
  email: string;

  @IsOptional()
  idGoogle: string;
}

export class LoginUserRequest {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginResponse {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}

export class ChangePasswordRequest {
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @Length(6, 20)
  oldPassword: string;

  @IsNotEmpty()
  @Length(6, 20)
  newPassword: string;
}

export class ChangePasswordResponse {
  @IsNotEmpty()
  isSuccess: boolean;
  constructor(success: boolean) {
    this.isSuccess = success;
  }
}

export class VerifyFirebaseRequest {
  @IsNotEmpty()
  token: string;
}

export class GetUserQuery extends QueryFilter {}

export class LoginFirebaseResponse {
  accessToken: string;

  @IsOptional()
  message: string;

  constructor(accessToken?: string, message?: string) {
    if (message) this.message = message;
    if (accessToken) this.accessToken = accessToken;
  }
}
