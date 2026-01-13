import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdentityRoleService } from '../../../application/services/identity-role.service';
import { RoleResponse } from '../models/role.response';

@ApiTags('Identity / Roles')
@Controller('identity/roles')
@UseInterceptors(ClassSerializerInterceptor)
export class IdentityRolesController {
  constructor(private readonly service: IdentityRoleService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати довідник ролей' })
  @ApiResponse({ status: 200, type: [RoleResponse] })
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
