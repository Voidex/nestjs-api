import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { initialConfig } from './db.config';

@Module({
  imports: [
    MongooseModule.forRoot(
      initialConfig,
      {
        useNewUrlParser: true,
        useCreateIndex: true
      }
  )]
})
export class DatabaseModule {}