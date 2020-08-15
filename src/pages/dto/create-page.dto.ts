import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty({
    description: 'Name of the page',
    required: true,
    type: String,
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Generic values for the page',
  })
  additionalFields?: Record<string, unknown>;
}
