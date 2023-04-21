import { BadRequestException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Document, UpdateQuery } from 'mongoose';
import { Role } from 'constants/roles';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ sparse: true, unique: true })
  phoneNumber?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: UserStatus.ACTIVE, enum: UserStatus, required: true })
  status: UserStatus;

  @Prop({ default: Role.USER, enum: Role })
  role: Role;
  @Prop()
  updatedAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  idFirebase: string;

  comparePassword: (candidatePassword: string) => Promise<void>;
}

export class DocumentFile {
  name: string;
  path: string;
  mimetype: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  const password = this.get('password') as string;
  const hashed = await hash(password, 10);
  this.set('password', hashed);
});

UserSchema.pre('updateOne', async function () {
  const update = this.getUpdate() as UpdateQuery<UserDocument>;
  if (update['password'] && typeof update['password'] === 'string') {
    const password = update['password'];
    const hashed = await hash(password, 10);
    await this.set({ password: hashed });
  }
});

UserSchema.methods['comparePassword'] = async function (candidatePassword: string) {
  const passwordValid = await compare(candidatePassword, this['password'] as string);

  if (!passwordValid) {
    throw new BadRequestException('Invalid password');
  }
};
