import { Module } from '@nestjs/common';
import { UserGraphqlModule } from './user/userGqlModule';
import { AuthGraphqlModule } from './auth/authGqlModule';

@Module({
  imports: [
    UserGraphqlModule,
    AuthGraphqlModule,
  ],
})
export class GraphqlResolversModule {}
