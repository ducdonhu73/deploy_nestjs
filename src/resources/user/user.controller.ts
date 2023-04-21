import { Controller, Get, Body, Put, Delete, Post, Query, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'decorators/auth.decorator';
import {
  ChangePasswordRequest,
  UserResponse,
  DeleteUserRequest,
  LoginUserRequest,
  LoginResponse,
  RegisterUserRequest,
  UpdateUserRequest,
  VerifyFirebaseRequest,
  GetUserQuery,
  LoginFirebaseResponse,
} from './dto/user.dto';
import { PaginationDataResponse } from 'dtos/pagination.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('register')
  registerUser(@Body() request: RegisterUserRequest): Promise<LoginResponse> {
    return this.UserService.register(request);
  }

  @Post('login')
  loginUser(@Body() request: LoginUserRequest): Promise<LoginResponse> {
    return this.UserService.login(request);
  }

  @Post('change-password')
  changePassword(@Body() request: ChangePasswordRequest): Promise<void> {
    return this.UserService.changePassword(request);
  }
  /*
   * thông tin của user
   */
  @Get('me')
  getMyInfo(@UserId() userId: string): Promise<UserResponse> {
    return this.UserService.getById(userId);
  }

  @Get(':id')
  getUserById(@Param('id') userId: string) {
    return this.UserService.getById(userId);
  }

  @Get()
  getAllUser(@Query() query: GetUserQuery): Promise<PaginationDataResponse<UserResponse>> {
    return this.UserService.getAllUsers(query);
  }

  @Put('me')
  updateMyInfo(@UserId() userId: string, @Body() request: UpdateUserRequest): Promise<UserResponse> {
    return this.UserService.updateUser(userId, request);
  }

  @Delete('me/delete')
  deleteUser(@UserId() userId: string, @Body() request: DeleteUserRequest): Promise<void> {
    return this.UserService.deleteAccount(userId, request.password);
  }

  @Post('login-firebase')
  verifyLoginFirebase(@Body() request: VerifyFirebaseRequest): Promise<LoginFirebaseResponse> {
    return this.UserService.loginFirebase(request);
  }

  @Post('admin-register')
  adminRegister(@Body() request: RegisterUserRequest): Promise<LoginResponse> {
    return this.UserService.adminRegister(request);
  }

  @Post('admin-login')
  adminLogin(@Body() request: LoginUserRequest): Promise<LoginResponse> {
    return this.UserService.adminLogin(request);
  }
}
