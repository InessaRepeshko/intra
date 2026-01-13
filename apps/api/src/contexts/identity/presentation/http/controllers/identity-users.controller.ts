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
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdentityUserService } from '../../../application/services/identity-user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserHttpMapper } from '../mappers/user.http.mapper';
import { UserQueryDto } from '../dto/user-query.dto';
import { UsersPageDto } from '../dto/users-page.dto';
import { UserResponse } from '../models/user.response';
import { AssignRolesDto } from '../dto/assign-roles.dto';

@ApiTags('Identity / Users')
@Controller('identity/users')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserResponse })
export class IdentityUsersController {
  constructor(private readonly service: IdentityUserService) {}

  @Post()
  @ApiOperation({ summary: 'Створити користувача' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponse })
  async create(@Body() dto: CreateUserDto): Promise<UserResponse> {
    const created = await this.service.create({
      firstName: dto.firstName,
      secondName: dto.secondName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash: dto.passwordHash,
      status: dto.status,
      positionId: dto.positionId,
      teamId: dto.teamId,
      managerId: dto.managerId,
    });
    return UserHttpMapper.toResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Пошук користувачів' })
  @ApiResponse({ status: HttpStatus.OK, type: UsersPageDto })
  async search(@Query() query: UserQueryDto): Promise<UsersPageDto> {
    const result = await this.service.search({
      ...query,
    });
    return {
      items: result.items.map(UserHttpMapper.toResponse),
      count: result.count,
      total: result.total,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати користувача за id' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  async getById(@Param('id') id: string): Promise<UserResponse> {
    const user = await this.service.getById(Number(id), { withRoles: true });
    return UserHttpMapper.toResponse(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити користувача' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserResponse> {
    const updated = await this.service.update(Number(id), {
      firstName: dto.firstName,
      secondName: dto.secondName,
      lastName: dto.lastName,
      passwordHash: dto.passwordHash,
      status: dto.status,
      positionId: dto.positionId,
      teamId: dto.teamId,
      managerId: dto.managerId,
    });
    return UserHttpMapper.toResponse(updated);
  }

  @Put(':id/roles')
  @ApiOperation({ summary: 'Змінити ролі користувача (повна заміна)' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  async replaceRoles(@Param('id') id: string, @Body() dto: AssignRolesDto): Promise<UserResponse> {
    const updated = await this.service.replaceRoles(Number(id), dto.roles);
    return UserHttpMapper.toResponse(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Видалити користувача' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(Number(id));
  }
}
