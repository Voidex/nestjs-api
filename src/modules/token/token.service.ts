import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { SignOptions } from 'jsonwebtoken';
import { 
  RefreshToken,
  RefreshTokenDocument
} from './schemas/refreshTokens.schema';
import { UserDocument } from '../user/schemas/user.schema';


const BASE_OPTIONS: SignOptions = {
  issuer: 'https://my-app.com',
  audience:'https://my-app.com',
};

const DEFAULT_REFRESH_TOKEN_TTL = 60 * 60 * 24 * 5;

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly jwtService: JwtService
  ) {}

  async generateAccessToken(user: UserDocument): Promise<string> {
    const { id: subject } = user;

    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject,
    };

    return this.jwtService.signAsync({}, opts);
  }

  async createRefreshToken(user: UserDocument, ttl: number): Promise<RefreshTokenDocument> {
    const { id: userId } = user;
    const expires = new Date();

    expires.setTime(expires.getTime() + ttl);

    const tokenInfo = {
      userId: Types.ObjectId(userId),
      expires,
    };

    return this.refreshTokenModel.create(tokenInfo);
  }

  async generateRefreshToken(user: UserDocument, expiresIn: number = DEFAULT_REFRESH_TOKEN_TTL ): Promise<string> {
    const {id: jwtid, userId: subject} = await this.createRefreshToken(user, expiresIn);

    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      jwtid,
      subject: subject.toHexString(),
    };

    return this.jwtService.signAsync({}, opts);
  }

  async findRefreshTokenById(id: string): Promise<RefreshToken | void> {
    return this.refreshTokenModel.findOne({_id: id});
  }

  async revokeRefreshToken(tokenId: string): Promise<boolean> {
    await this.refreshTokenModel.updateOne({ _id: tokenId }, { $set: { isRevoked: true }});

    return true;
  }


}