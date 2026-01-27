import { PositionDomain } from '../../../domain/position.domain';
import { PositionResponse } from '../models/position.response';

export class PositionHttpMapper {
  static toResponse(domain: PositionDomain): PositionResponse {
    const view = new PositionResponse();
    view.id = domain.id!;
    view.title = domain.title;
    view.description = domain.description;
    view.createdAt = domain.createdAt!;
    view.updatedAt = domain.updatedAt!;
    return view;
  }
}
