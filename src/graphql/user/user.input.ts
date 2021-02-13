import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field(type => String)
  email: string;

  @Field(type => String)
  login: string;

  @Field(type => String)
  name: string;

  @Field(type => String)
  password: string;

  @Field(type => String, { nullable: true })
  surname?: string;

  @Field(type => Date)
  birthdate: Date;
}
