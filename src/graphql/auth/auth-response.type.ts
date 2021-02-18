import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../user/user.type';

@ObjectType()
export class AuthResponse {
  @Field(type => User)
  user: User;

  @Field(type => String)
  accessToken: string;

  @Field(type => String)
  refreshToken: string;
}

@ObjectType()
export class LogoutResponse {
  @Field(type => Boolean)
  result: boolean;

}

