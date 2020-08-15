import { CreatePageDto } from './create-page.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdatePageDto extends PartialType(
  OmitType(CreatePageDto, ['name'] as const),
) {}
