import { Schema } from '@hapi/joi';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { GenericType } from './generic.type';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Schema) {}

  transform(value: GenericType): GenericType {
    const { error } = this.schema.validate(value);

    if (error) throw new BadRequestException(error);

    return value;
  }
}
