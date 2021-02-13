import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { join } from 'path';
import { GraphqlResolversModule } from './graphql/resolvers.module';


@Module({
  imports: [
    AuthModule,
    GraphqlResolversModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      debug: true
    }),
    UserModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
