import { Schema } from '@hapi/joi';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

type genericType = string | number | [] | Record<string, unknown>;

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Schema) {}

  transform(value: genericType): genericType {
    const { error } = this.schema.validate(value);

    if (error) throw new BadRequestException(error);

    return value;
  }
}
