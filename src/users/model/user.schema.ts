import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as Joi from '@hapi/joi';

export enum UserStatuses {
  active = 'ACTIVE',
  inactive = 'INACTIVE',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, trim: true })
  firstName?: string;

  @Prop({ type: String, trim: true })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: UserStatuses, default: UserStatuses.active })
  status: UserStatuses;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const createUserValidationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
  firstName: Joi.string()
    .trim()
    .min(2),
  lastName: Joi.string()
    .trim()
    .min(2),
  password: Joi.string().required(),
}).required();
