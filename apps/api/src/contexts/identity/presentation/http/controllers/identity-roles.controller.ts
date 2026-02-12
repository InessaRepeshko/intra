import { IdentityRole } from '@intra/shared-kernel';
import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthSessionGuard } from 'src/auth/guards/auth-session.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiListReadErrorResponses } from 'src/common/documentation/api.error.responses.decorator';
import { IdentityRoleService } from '../../../application/services/identity-role.service';
import { RoleResponse } from '../models/role.response';

@ApiTags('Identity / Roles')
@Controller('identity/roles')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(IdentityRole.ADMIN, IdentityRole.HR)
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
