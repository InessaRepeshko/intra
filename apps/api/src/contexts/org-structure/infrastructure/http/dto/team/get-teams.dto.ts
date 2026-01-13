import { WithPagination } from 'src/common/mixins/with-pagination.mixin';
import { TeamFilterDto } from './team-filter.dto';

export class GetTeamsDto extends WithPagination(TeamFilterDto) {}

