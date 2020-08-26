import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvatarResponseDto {
  @ApiProperty({
    description: 'Path for profile picture',
    required: true,
    type: String,
  })
  path: string;
}
