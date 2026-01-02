import { WithPagination } from 'src/common/mixins/with-pagination.mixin';
import { PositionFilterDto } from './position-filter.dto';

export class GetPositionsDto extends WithPagination(PositionFilterDto) {}


