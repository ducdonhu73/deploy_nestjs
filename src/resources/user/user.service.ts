import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  ChangePasswordRequest,
  UserResponse,
  LoginUserRequest,
  LoginResponse,
  RegisterUserRequest,
  UpdateUserRequest,
  VerifyFirebaseRequest,
  GetUserQuery,
  LoginFirebaseResponse,
} from './dto/user.dto';
import { User, UserDocument, UserStatus } from './entities/user.entity';
import jwt from 'jsonwebtoken';
import { Role } from 'constants/roles';
import { getAuth } from 'firebase-admin/auth';
import { PaginationDataResponse } from 'dtos/pagination.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async register(request: RegisterUserRequest): Promise<LoginResponse> {
    const filter = { phoneNumber: request.phoneNumber };
    const User = await this.UserModel.findOne(filter).exec();
    if (User) {
      throw new BadRequestException('Phone number exist');
    }
    const { firstName, lastName, phoneNumber, email, password, confirmPassword, idGoogle } = request;
    if (confirmPassword !== password) throw new BadRequestException('Passwords are not the same!');
    const newUser = await this.UserModel.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      idGoogle,
    });
    const authToken = this.createToken(newUser.id as string);
    return new LoginResponse(authToken);
  }

  async login(request: LoginUserRequest): Promise<LoginResponse> {
    const { email, password } = request;

    const user = await this.UserModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('No User found');
    }

    await user.comparePassword(password);

    if (user.status === UserStatus.INACTIVE) {
      throw new BadRequestException('User is inactive');
    }

    if (user.status === UserStatus.DELETED) {
      throw new BadRequestException('User is deleted');
    }
    // const authToken = await this.auth.createCustomToken(user.id as string);

    const authToken =
      user.role === Role.ADMIN ? this.createAdminToken(user.id as string) : this.createToken(user.id as string);
    return new LoginResponse(authToken);
  }

  async getAllUsers(query: GetUserQuery): Promise<PaginationDataResponse<UserResponse>> {
    const { page, limit, search, startDate, endDate, orderBy = 1, sortBy = 'createdAt' } = query;
    let listUser: UserDocument[] = [];
    const filter: FilterQuery<UserDocument> = {};

    if (search) {
      filter.firstName = { $regex: new RegExp(`^${search}`, 'i') };
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }

    listUser = await this.UserModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: orderBy < 0 ? 1 : -1 });
    const response = listUser.map((User) => new UserResponse(User));
    const total = listUser.length;
    return new PaginationDataResponse(response, { page, limit, total });
  }

  async changePassword(changePasswordRequest: ChangePasswordRequest): Promise<void> {
    const { phoneNumber, oldPassword, newPassword } = changePasswordRequest;

    if (oldPassword === newPassword) {
      throw new BadRequestException('New password must be different from old password');
    }

    const User = await this.UserModel.findOne({ phoneNumber }).exec();
    if (!User) {
      throw new BadRequestException('dont find User by phonenumber');
    }
    await User.comparePassword(oldPassword);
    await User.updateOne({ password: newPassword });
    console.log('end');
  }

  async getById(userId: string): Promise<UserResponse> {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return new UserResponse(user);
  }

  async updateUser(userId: string, updateUserRequest: UpdateUserRequest): Promise<UserResponse> {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await user.updateOne(updateUserRequest);
    return new UserResponse(user);
  }

  async deleteAccount(userId: string, password: string): Promise<void> {
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await user.comparePassword(password);
    await user.updateOne({ status: UserStatus.DELETED });
  }

  private createToken(userId: string): string {
    const secretKey = process.env['JWT_SECRET'];

    if (!secretKey) {
      throw new BadRequestException('Secret key not found');
    }

    return jwt.sign(
      {
        id: userId,
        role: Role.USER,
      },
      secretKey,
    );
  }
  private createAdminToken(userId: string): string {
    const secretKey = process.env['JWT_SECRET'];

    if (!secretKey) {
      throw new BadRequestException('Secret key not found');
    }

    return jwt.sign(
      {
        id: userId,
        role: Role.ADMIN,
      },
      secretKey,
    );
  }

  async loginFirebase(request: VerifyFirebaseRequest): Promise<LoginFirebaseResponse> {
    const { token } = request;
    const decodedToken = await getAuth().verifyIdToken(token);
    const {
      email,
      uid,
      phone_number,
      name,
      firebase: { sign_in_provider },
    } = decodedToken;
    if (!email) throw new BadRequestException('verify failed!');
    const User = await this.UserModel.findOne({ idFirebase: uid });
    if (User) {
      const message: string = 'login with ' + sign_in_provider + ' success!';
      const authToken = this.createToken(User.id as string);
      return new LoginFirebaseResponse(authToken, message);
    }

    const UserFindByEmail = await this.UserModel.findOne({ email: email });
    if (UserFindByEmail) throw new BadRequestException('Email exist');
    const UserFindByPhone = await this.UserModel.findOne({
      phoneNumber: phone_number,
    });
    if (UserFindByPhone) throw new BadRequestException('Phone exist');

    const password = Math.round(Math.random() * 100000000).toString();
    const nameArray = (name as string).split(' ');
    const newUser = await this.UserModel.create({
      firstName: nameArray[0],
      lastName: nameArray.slice(1).join(' '),
      phoneNumber: phone_number,
      email,
      password,
      idFirebase: uid,
    });
    const authToken = this.createToken(newUser.id as string);
    return new LoginFirebaseResponse(authToken, 'Created new User account with ' + sign_in_provider);
  }

  async adminRegister(request: RegisterUserRequest): Promise<LoginResponse> {
    const filter = { phoneNumber: request.phoneNumber };
    const admin = await this.UserModel.findOne(filter).exec();
    if (admin) {
      throw new BadRequestException('Phone number exist');
    }
    const { firstName, lastName, phoneNumber, email, password, confirmPassword, idGoogle } = request;
    if (confirmPassword !== password) throw new BadRequestException('Passwords are not the same!');
    const newAdmin = await this.UserModel.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      idGoogle,
      role: Role.ADMIN,
    });
    const authToken = this.createAdminToken(newAdmin.id as string);
    return new LoginResponse(authToken);
  }
  async adminLogin(request: LoginUserRequest): Promise<LoginResponse> {
    const { email, password } = request;

    const admin = await this.UserModel.findOne({ email }).exec();
    if (!admin) {
      throw new BadRequestException('No User found');
    }

    await admin.comparePassword(password);

    if (admin.status === UserStatus.INACTIVE) {
      throw new BadRequestException('Seller is inactive');
    }

    if (admin.status === UserStatus.DELETED) {
      throw new BadRequestException('Seller is deleted');
    }
    // const authToken = await this.auth.createCustomToken(user.id as string);

    const authToken = this.createAdminToken(admin.id as string);
    return new LoginResponse(authToken);
  }
}
