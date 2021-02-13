import { UserService } from '../../modules/user/user.service';
import { Args, Query, Resolver, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './user.type';
import { UserDocument } from 'src/modules/user/schemas/user.schema';
import { GqlAuthGuard } from '../auth/auth-jwt.guard';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  async user(@Args('id', { type: () => ID }) id: string): Promise<UserDocument | void> {
    return this.userService.getById(id);
  }

  @Query(returns => [User])
  @UseGuards(GqlAuthGuard)
  async users(): Promise<UserDocument[]> {
    return this.userService.getUsers();
  }
}