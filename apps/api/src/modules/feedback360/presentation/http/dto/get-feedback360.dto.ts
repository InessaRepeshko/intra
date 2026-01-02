import { WithPagination } from 'src/common/mixins/with-pagination.mixin';
import { Feedback360FilterDto } from './feedback360-filter.dto';

export class GetFeedback360Dto extends WithPagination(Feedback360FilterDto) {}


