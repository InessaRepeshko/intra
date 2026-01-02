import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE } from '../constants/pagination.constants';
import { ToOptionalInt } from '../transforms/query-sanitize.transform';

export type Constructor<T = any> = new (...args: any[]) => T;

export function WithPagination<TBase extends Constructor>(Base: TBase) {
  class PaginationMixin extends Base {
    @ApiProperty({
      required: false,
      description: 'Number of items to skip',
      type: 'number',
      minimum: 0,
    })
    @ToOptionalInt({ min: 0 })
    @IsOptional()
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
    @ToOptionalInt({ min: 1, max: PAGINATION_MAX_TAKE })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(PAGINATION_MAX_TAKE)
    take?: number;
  }

  return PaginationMixin;
}


