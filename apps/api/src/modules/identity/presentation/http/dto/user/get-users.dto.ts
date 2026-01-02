import { WithPagination } from 'src/common/mixins/with-pagination.mixin';
import { UserFilterDto } from './user-filter.dto';

export class GetUsersDto extends WithPagination(UserFilterDto) {}


