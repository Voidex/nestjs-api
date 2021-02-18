import { UserService } from '../../modules/user/user.service';
import { Args, Query, Resolver, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './user.type';
import { GqlAuthGuard } from '../auth/guards/auth-jwt.guard';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  async user(@Args('id', { type: () => ID }) id: string): Promise<User | void> {
    return this.userService.getById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => [User])
  async users(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
