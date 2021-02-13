import { Module } from '@nestjs/common';
import { UserGraphqlModule } from './user/user-gql-module';
import { AuthGraphqlModule } from './auth/auth-gql-module';

@Module({
  imports: [UserGraphqlModule, AuthGraphqlModule],
})
export class GraphqlResolversModule {}
