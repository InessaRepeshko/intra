import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  PAGINATION_DEFAULT_SKIP,
  PAGINATION_DEFAULT_TAKE,
  PAGINATION_MAX_TAKE,
  PAGINATION_MIN_SKIP,
  PAGINATION_MIN_TAKE,
} from '../constants/pagination.constants';
import { ToOptionalInt } from '../transforms/query-sanitize.transform';

export type Constructor<T = any> = new (...args: any[]) => T;

export function WithPagination<TBase extends Constructor>(Base: TBase) {
  class PaginationMixin extends Base {
    @ApiProperty({
      required: false,
      description: 'Number of items to skip',
      type: 'number',
      example: 1,
      minimum: PAGINATION_MIN_SKIP,
      default: PAGINATION_DEFAULT_SKIP,
    })
    @ToOptionalInt({ min: PAGINATION_MIN_SKIP })
    @IsOptional()
    @IsInt()
    @Min(PAGINATION_MIN_SKIP)
    skip?: number;

    @ApiProperty({
      required: false,
      description: 'Number of items to take',
      type: 'number',
      example: 10,
      minimum: PAGINATION_MIN_TAKE,
      maximum: PAGINATION_MAX_TAKE,
      default: PAGINATION_DEFAULT_TAKE,
    })
    @ToOptionalInt({ min: PAGINATION_MIN_TAKE, max: PAGINATION_MAX_TAKE })
    @IsOptional()
    @IsInt()
    @Min(PAGINATION_MIN_TAKE)
    @Max(PAGINATION_MAX_TAKE)
    take?: number;
  }

  return PaginationMixin;
}


