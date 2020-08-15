import { ApiProperty } from '@nestjs/swagger';
import { UserStatuses } from '../model/user.schema';

export class CreateUserDto {
  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  status?: UserStatuses.active;
}
