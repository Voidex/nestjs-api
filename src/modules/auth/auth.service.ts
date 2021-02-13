import { Injectable, BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { UserInput } from 'src/graphql/user/user.input';
import { UserDocument } from '../user/schemas/user.schema';
import { JwtAccessPayload } from './jwt.config';

interface AuthResponse {
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register(userInput: UserInput): Promise<UserDocument> {
    const { email, password: rawPassword } = userInput;

    if (!this.emailFormatIsValid(email)) {
      throw new BadRequestException('Wrong email address format!');
    }

    const userExists = await this.userService.isUserExists(email);

    if (userExists) {
      throw new BadRequestException(
        'User with provided email is already exists',
      );
    }

    if (!this.passwordLengthIsValid(rawPassword)) {
      throw new BadRequestException(
        'Password must be not less than 5 characters',
      );
    }

    const password = await this.hashUserPassword(rawPassword);

    return this.userService.createNewUser({ ...userInput, password });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new BadRequestException('User with provided email is not exist!');
    }

    const { password: passwordHash } = user;

    const isPasswordValid = await this.compareUserPassword(
      password,
      passwordHash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Provided password is wrong!');
    }

    return this.generateAuthResponse(user);
  }

  async logout(): Promise<void> {}

  async hashUserPassword(password: string): Promise<string> {
    const rounds = +process.env.SALT_ROUNDS || 12;

    return bcrypt.hash(password, rounds);
  }

  async compareUserPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async getUserFromJwtPayload(
    payload: JwtAccessPayload,
  ): Promise<UserDocument | void> {
    const { sub: userId } = payload;
    return this.userService.getById(userId);
  }

  async generateTokens(user: UserDocument) {
    return Promise.all([
      this.tokenService.generateAccessToken(user),
      this.tokenService.generateRefreshToken(user),
    ]);
  }

  async generateAuthResponse(user: UserDocument): Promise<AuthResponse> {
    const [accessToken, refreshToken] = await this.generateTokens(user);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  passwordLengthIsValid(password: string): boolean {
    return password.length >= 5;
  }

  emailFormatIsValid(email: string): boolean {
    return (
      email.search(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}/g) > -1
    );
  }
}
