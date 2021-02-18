import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../../modules/auth/auth.service';
import { User } from '../user/user.type';
import { UserInput } from '../user/user.input';
import { AuthResponse, LogoutResponse } from './auth-response.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/auth-jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDocument } from 'src/modules/user/schemas/user.schema';

@Resolver(of => 'Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(returns => User)
  async registerNewUser(
    @Args({ name: 'user', type: () => UserInput }) user: UserInput,
  ): Promise<User> {
    return this.authService.register(user);
  }

  @Mutation(returns => AuthResponse)
  async login(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<AuthResponse> {
    return this.authService.login(email, password);
  }

  @Mutation(returns => AuthResponse)
  async refreshAccessToken(
    @Args({ name: 'refreshToken', type: () => String }) refreshToken: string
  ) : Promise<AuthResponse> {
      return this.authService.renewAccessToken(refreshToken);
    }


  @UseGuards(GqlAuthGuard)
  @Mutation(returns => LogoutResponse)
  async logout(@CurrentUser() user: UserDocument): Promise<LogoutResponse> {
    console.log(user);
    return this.authService.logout(user);
  }
}
