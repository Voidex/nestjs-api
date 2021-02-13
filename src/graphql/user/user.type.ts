import { Field, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class User {
  @Field(type => String, { nullable: true })
  _id?: Types.ObjectId;

  @Field(type => String)
  email: string;

  @Field(type => String)
  login: string;

  @Field(type => String)
  name: string;

  @Field(type => String, { nullable: true })
  surname?: string;

  @Field(type => Date)
  birthdate: Date;

}