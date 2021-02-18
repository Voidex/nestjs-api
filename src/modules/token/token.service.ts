import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';
import { UserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { JwtAccessPayload, JwtRefreshPayload } from '../auth/jwt.config';

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://my-app.com',
  audience: 'https://my-app.com',
};

const DEFAULT_REFRESH_TOKEN_TTL = 60 * 60 * 24 * 5;

interface RefreshTokenPayload {
  jti: string;
  sub: string;
}

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private async generateAccessToken(user: UserDocument): Promise<string> {
    const { id: subject } = user;

    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject,
    };

    return this.jwtService.signAsync({}, opts);
  }

  private async generateRefreshToken(
    user: UserDocument,
    expiresIn: number = DEFAULT_REFRESH_TOKEN_TTL,
  ): Promise<string> {
    const { id: jwtid, userId: subject } = await this.createRefreshToken(
      user,
      expiresIn,
    );

    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      jwtid,
      subject: subject.toHexString(),
    };

    return this.jwtService.signAsync({}, opts);
  }

  private async createRefreshToken(
    user: UserDocument,
    ttl: number,
  ): Promise<RefreshTokenDocument> {
    const { id: userId } = user;
    const expires = new Date();

    expires.setTime(expires.getTime() + ttl);

    const tokenInfo = {
      userId: Types.ObjectId(userId),
      expires,
    };

    return this.refreshTokenModel.create(tokenInfo);
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  public async createAccessAndRefreshTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ accessToken: string; refreshToken: string, user: UserDocument }> {
    const { user } = await this.resolveRefreshToken(refresh);

    const [accessToken, refreshToken] = await this.generateTokens(user);

    return { accessToken, refreshToken, user };
  }

  private async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: UserDocument; token: RefreshTokenDocument }> {
    const payload = await this.decodeRefreshToken(encoded);

    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    const { id, isRevoked } = token;

    if (isRevoked) {
      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this.getUserFromJwtPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    await this.revokeRefreshToken(id);

    return { user, token };
  }

  private async findRefreshTokenById(
    id: string,
  ): Promise<RefreshTokenDocument | void> {
    return this.refreshTokenModel.findOne({ _id: id });
  }

  private async revokeRefreshToken(tokenId: string): Promise<boolean> {
    await this.refreshTokenModel.updateOne(
      { _id: tokenId },
      { $set: { isRevoked: true } },
    );

    return true;
  }

  async revokeAllUserRefreshTokens(user: UserDocument): Promise<{ result: boolean }> {
    const { id } = user;
    await this.refreshTokenModel.updateMany(
      { userId: Types.ObjectId(id), isRevoked: false },
      {$set: { isRevoked: true }},
    );

    return { result: true };
  }

  async getUserFromJwtPayload(
    payload: JwtAccessPayload | JwtRefreshPayload,
  ): Promise<UserDocument | void> {
    const { sub: userId } = payload;

    if (!userId) {
      throw new UnprocessableEntityException('Token is malfored');
    }

    return this.userService.getById(userId);
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshTokenDocument | void> {
    const { jti: tokenId } = payload;

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.findRefreshTokenById(tokenId);
  }

  async generateTokens(user: UserDocument) {
    return Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);
  }
}
