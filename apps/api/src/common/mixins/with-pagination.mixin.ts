import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE } from '../constants/pagination.constants';

export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Міксин для додавання skip/take у query DTO (аналогічно твоєму прикладу).
 */
export function WithPagination<TBase extends Constructor>(Base: TBase) {
  class PaginationMixin extends Base {
    @ApiProperty({
      required: false,
      description: 'Number of items to skip',
      type: 'number',
      minimum: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    skip?: number;

    @ApiProperty({
      required: false,
      description: 'Number of items to take',
      type: 'number',
      minimum: 1,
      maximum: PAGINATION_MAX_TAKE,
      default: PAGINATION_DEFAULT_TAKE,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(PAGINATION_MAX_TAKE)
    take?: number;
  }

  return PaginationMixin;
}


