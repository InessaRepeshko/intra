import { IdentityRole } from '@intra/shared-kernel';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
    Query,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthSessionGuard } from 'src/auth/guards/auth-session.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
    ApiCreateAndUpdateErrorResponses,
    ApiDeletionErrorResponses,
    ApiListReadErrorResponses,
    ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { IdentityUserService } from '../../../application/services/identity-user.service';
import { AssignRolesDto } from '../dto/assign-roles.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserQueryDto } from '../dto/user-query.dto';
import { UserHttpMapper } from '../mappers/user.http.mapper';
import { UserResponse } from '../models/user.response';

@ApiTags('Identity / Users')
@Controller('identity/users')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserResponse })
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(IdentityRole.ADMIN)
export class IdentityUsersController {
    constructor(private readonly service: IdentityUserService) {}

    @Post()
    @Roles(IdentityRole.ADMIN, IdentityRole.HR)
    @ApiOperation({ summary: 'Create a user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: UserResponse })
    @ApiCreateAndUpdateErrorResponses()
    async create(@Body() dto: CreateUserDto): Promise<UserResponse> {
        const created = await this.service.create({
            firstName: dto.firstName,
            secondName: dto.secondName,
            lastName: dto.lastName,
            fullName: dto.fullName,
            email: dto.email,
            status: dto.status,
            positionId: dto.positionId,
            teamId: dto.teamId,
            managerId: dto.managerId,
            roles: dto.roles,
        });
        return UserHttpMapper.toResponse(created);
    }

    @Get()
    @Roles(
        IdentityRole.ADMIN,
        IdentityRole.HR,
        IdentityRole.MANAGER,
        IdentityRole.EMPLOYEE,
    )
    @ApiOperation({ summary: 'Search users (default sort ascending by id)' })
    @ApiQuery({ type: UserQueryDto })
    @ApiResponse({ status: HttpStatus.OK, type: UserResponse, isArray: true })
    @ApiListReadErrorResponses()
    async search(@Query() query: UserQueryDto): Promise<UserResponse[]> {
        const users = await this.service.search({
            ...query,
        });
        return users.map(UserHttpMapper.toResponse);
    }

    @Get(':id')
    @Roles(
        IdentityRole.ADMIN,
        IdentityRole.HR,
        IdentityRole.MANAGER,
        IdentityRole.EMPLOYEE,
    )
    @ApiOperation({ summary: 'Get a user by id' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of user' })
    @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
    @ApiReadErrorResponses()
    async getById(@Param('id') id: string): Promise<UserResponse> {
        const user = await this.service.getById(Number(id), {
            withRoles: true,
        });
        return UserHttpMapper.toResponse(user);
    }

    @Patch(':id')
    @Roles(IdentityRole.ADMIN, IdentityRole.HR)
    @ApiOperation({ summary: 'Update a user' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of user' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
    @ApiCreateAndUpdateErrorResponses()
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
    ): Promise<UserResponse> {
        const updated = await this.service.update(Number(id), {
            firstName: dto.firstName,
            secondName: dto.secondName,
            lastName: dto.lastName,
            status: dto.status,
            positionId: dto.positionId,
            teamId: dto.teamId,
            managerId: dto.managerId,
        });
        return UserHttpMapper.toResponse(updated);
    }

    @Put(':id/roles')
    @ApiOperation({ summary: 'Change the user roles (full replacement)' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of user' })
    @ApiBody({ type: AssignRolesDto })
    @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
    @ApiCreateAndUpdateErrorResponses()
    async replaceRoles(
        @Param('id') id: string,
        @Body() dto: AssignRolesDto,
    ): Promise<UserResponse> {
        const updated = await this.service.replaceRoles(Number(id), dto.roles);
        return UserHttpMapper.toResponse(updated);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a user' })
    @ApiParam({ name: 'id', type: 'number', description: 'Id of user' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    @ApiDeletionErrorResponses()
    async delete(@Param('id') id: string): Promise<void> {
        await this.service.delete(Number(id));
    }
}
