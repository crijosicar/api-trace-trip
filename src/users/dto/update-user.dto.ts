import { CreateUserDto, AdditionalUserData } from './create-user.dto';
import { IntersectionType } from '@nestjs/swagger';

export class UpdateUserDto extends IntersectionType(
  CreateUserDto,
  AdditionalUserData,
) {}
