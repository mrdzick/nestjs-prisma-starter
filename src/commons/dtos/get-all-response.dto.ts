import { ApiProperty } from '@nestjs/swagger';

export class GetAllResponseDto<T> {
  @ApiProperty({
    example: 1,
  })
  length: number;

  @ApiProperty({ isArray: true })
  data: T[];
}

export class PaginateGetAllResponseDto<T> extends GetAllResponseDto<T> {
  @ApiProperty({
    example: 1,
  })
  current_page: number;

  @ApiProperty({
    example: 1,
  })
  total_page: number;
}
