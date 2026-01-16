import { ClassSerializerInterceptor, Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdentityRoleService } from '../../../application/services/identity-role.service';
import { RoleResponse } from '../models/role.response';
import { ApiListReadErrorResponses } from 'src/common/documentation/api.error.responses.decorator';

@ApiTags('Identity / Roles')
@Controller('identity/roles')
@UseInterceptors(ClassSerializerInterceptor)
export class IdentityRolesController {
  constructor(private readonly service: IdentityRoleService) {}

  @Get()
  @ApiOperation({ summary: 'Get the role dictionary' })
  @ApiResponse({ status: HttpStatus.OK, type: [RoleResponse] })
  @ApiListReadErrorResponses()
  async list(): Promise<RoleResponse[]> {
    const roles = await this.service.list();
    return roles.map((r) => {
      const view = new RoleResponse();
      view.code = r.code;
      view.title = r.title;
      view.description = r.description;
      return view;
    });
  }
}
