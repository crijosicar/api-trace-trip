import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as Joi from '@hapi/joi';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Page extends Document {}

export const PageSchema = SchemaFactory.createForClass(Page);

export const createPageValidationSchema = Joi.object({}).required();
