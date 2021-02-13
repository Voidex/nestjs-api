import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../../modules/auth/auth.service';
import { User } from '../user/user.type';
import { UserInput } from '../user/user.input';
import { AuthResponse } from './auth-response.type';

@Resolver(of => ('Auth'))
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

@Mutation(returns => User)
  async registerNewUser(@Args({ name: 'user', type: () => UserInput }) user: UserInput): Promise<User> {
    return this.authService.register(user);
  }

@Mutation(returns => AuthResponse)
async login(
  @Args({name: 'email', type: () => String}) email: string,
  @Args({name: 'password', type: () => String}) password: string,
  ): Promise<AuthResponse> {
    return this.authService.login(email, password);
  }
}