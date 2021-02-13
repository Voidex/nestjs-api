import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface UserDocument extends User, Document {}

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, lowercase: true, unique: true })
  email: string;

  @Prop()
  surname?: string;

  @Prop()
  password: string;

  @Prop({lowercase: true, unique: true})
  login: string;

  @Prop()
  birthdate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);