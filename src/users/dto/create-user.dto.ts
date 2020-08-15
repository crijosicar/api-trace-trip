import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatuses } from '../model/user.schema';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: 'FirstName of the user',
    type: String,
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'LastName of the user',
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
    enum: Object.values(UserStatuses),
  })
  status?: UserStatuses.active;

  @ApiProperty({
    description: 'URL Avatar for user ',
    type: String,
  })
  avatar?: string;
}
