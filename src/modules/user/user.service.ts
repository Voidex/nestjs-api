import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import dotenv from 'dotenv';
import { UserInput } from 'src/graphql/user/user.input';

dotenv.config();

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getByEmail(email: string): Promise<UserDocument | void> {
    return this.userModel.findOne({ email });
  }

  async getById(id: string): Promise<UserDocument | void> {
    return this.userModel.findOne({ _id: id }, { password: false });
  }

  async createNewUser(userInput: UserInput): Promise<UserDocument> {
    return this.userModel.create(userInput);
  }

  async isUserExists(email: string): Promise<UserDocument | void> {
    return this.getByEmail(email);
  }

  async getUsers(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async updateUserAccountInfo(id: string): Promise<void> {}
}
