import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { STRATEGY_JWT } from '../../modules/auth/jwt.strategy';

@Injectable()
export class GqlAuthGuard extends AuthGuard(STRATEGY_JWT) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}


