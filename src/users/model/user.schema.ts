import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as Joi from '@hapi/joi';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export enum UserStatuses {
  active = 'ACTIVE',
  inactive = 'INACTIVE',
}

@Schema({ timestamps: true })
export class User extends Document {
  @ApiPropertyOptional({
    description: 'FirstName of the user',
    type: String,
  })
  @Prop({ type: String, trim: true })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'LasstName of the user',
    type: String,
  })
  @Prop({ type: String, trim: true })
  lastName: string;

  @ApiProperty({
    description: 'Email of the user',
    required: true,
    type: String,
  })
  @Prop({
    required: true,
    unique: true,
    type: String,
    lowercase: true,
    trim: true,
  })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    required: true,
    type: String,
  })
  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: String })
  avatar: string;

  @ApiPropertyOptional({
    description: 'Status of the user',
    enum: Object.keys(UserStatuses),
  })
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
