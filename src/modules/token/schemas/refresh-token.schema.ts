import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface RefreshTokenDocument extends RefreshToken, Document {}

@Schema()
export class RefreshToken {
  @Prop({ required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ default: false })
  isRevoked?: boolean;

  @Prop({ required: true })
  expires: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
