// import { BeforeInsert, BeforeUpdate } from 'typeorm';
// import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Role {
  Admin = 'admin',
  Customer = 'customer',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: ObjectId, auto: true })
  id: ObjectId;

  @Prop({ name: 'email', unique: true })
  email: string;

  @Prop({ name: 'password' })
  password: string;

  @Prop({ name: 'firstname' })
  firstname: string;

  @Prop({ name: 'lastname' })
  lastname: string;

  @Prop({ name: 'roles' })
  roles: Role[];

  @Prop({ name: 'favorite_sources' })
  favorite_sources: ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
