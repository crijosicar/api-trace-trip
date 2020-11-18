import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as Joi from '@hapi/joi';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Page extends Document {
  @ApiProperty({
    description: 'Name of the page',
    required: true,
    type: String,
  })
  @Prop({ required: true, unique: true, type: String, trim: true })
  name: string;

  @ApiPropertyOptional({
    description: 'Dynamic values for the page',
  })
  @Prop()
  additionalFields?: Record<string, unknown>;
}

export const PageSchema = SchemaFactory.createForClass(Page);

export const createPageValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required(),
  additionalFields: Joi.object(),
}).required();

export const updatePageValidationSchema = Joi.object({
  additionalFields: Joi.object().required(),
}).required();
