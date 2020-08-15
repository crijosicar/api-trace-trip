import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatuses } from '../model/user.schema';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'FirstName of the user',
    type: String,
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'LasstName of the user',
    type: String,
  })
  lastName?: string;

  @ApiProperty({
    description: 'Email of the user',
    required: true,
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    required: true,
    type: String,
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Status of the user',
    enum: Object.keys(UserStatuses),
  })
  status?: UserStatuses.active;
}
