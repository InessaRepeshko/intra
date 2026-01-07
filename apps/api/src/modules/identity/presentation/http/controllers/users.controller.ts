import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  Query,
  SerializeOptions,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CreateUserInput, UpdateUserInput, UsersService } from '../../../application/users.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../models/user.entity';
import { UserWithRelations } from '../models/user-with-relations.entity';
import { UserHttpMapper } from '../mappers/user.http.mapper';
import { PUBLIC_SERIALISATION_GROUPS } from 'src/common/serialisation/public.serialisation.preset';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { GetUsersDto } from '../dto/user/get-users.dto';
import { UsersPageDto } from '../dto/user/users-page.dto';
import { UserResponseDto } from '../dto/user/user-response.dto';

@Controller('users')
@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: User, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @SerializeOptions({ type: User, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ 
    operationId: 'createUser',
    summary: 'Create a new user',
    description: 'Create a new user with the provided data.'
  })  
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: UserResponseDto,
  })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    const input: CreateUserInput = {
      firstName: dto.firstName,
      secondName: dto.secondName ?? null,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      positionId: dto.positionId,
      teamId: dto.teamId,
      managerId: dto.managerId ?? null,
    };
    const created = await this.usersService.create(input);
    return UserHttpMapper.fromDomain(created);
  }

  @Get()
  @ApiOperation({ 
    operationId: 'getAllUsers',
    summary: 'Get all users with filters, sorting and pagination',
    description: 'Get all users with filters, sorting and pagination for users'
  })
  @ApiQuery({
    name: 'query',
    type: GetUsersDto,
    required: false,
    description: 'Query parameters for filtering, sorting and pagination for users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved users',
    type: UsersPageDto,
  })
  @ApiListReadErrorResponses()
  async findAll(
    @Query() query?: GetUsersDto,
  ): Promise<UsersPageDto> {
    const result = await this.usersService.search(query);
    const items = result.items.map((u) => UserHttpMapper.fromDomain(u));
    return { items, count: result.count, total: result.total };
  }

  @Get(':id')
  @ApiOperation({ 
    operationId: 'getUserById',
    summary: 'Get a user by ID',
    description: 'Get a user by ID'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the user',
    example: 1
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
    description: 'The user has been successfully retrieved.'
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(+id);
    return UserHttpMapper.fromDomain(user);
  }

  @Get(':id/relations')
  @SerializeOptions({ type: UserWithRelations, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
  @ApiOperation({ 
    operationId: 'getUserByIdWithRelations',
    summary: 'Get a user by ID with all relationships',
    description: 'Get a user by ID with all relationships'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the user',
    example: 1
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserWithRelations,
    description: 'The user with relationships has been successfully retrieved.'
  })
  @ApiReadErrorResponses()
  async findOneWithRelations(@Param('id') id: string): Promise<UserWithRelations> {
    const user = await this.usersService.findOneWithRelations(+id);
    return UserHttpMapper.fromDomainWithRelations(user);
  }

  @Patch(':id')
  @SerializeOptions({ type: User, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({   
    operationId: 'updateUser',
    summary: 'Update a user by ID',
    description: 'Update a user by ID'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the user',
    example: 1
  })
  @ApiBody({
    required: true,
    type: UpdateUserDto,
    description: 'The user data to update'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
    description: 'The user has been successfully updated.'
  })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    const input: UpdateUserInput = {
      firstName: dto.firstName,
      secondName: dto.secondName,
      lastName: dto.lastName,
      positionId: dto.positionId,
      teamId: dto.teamId,
      managerId: dto.managerId,
      status: dto.status,
    };
    const updated = await this.usersService.update(+id, input);
    return UserHttpMapper.fromDomain(updated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    operationId: 'deleteUser',
    summary: 'Delete a user by ID',
    description: 'Delete a user by ID'
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'number',
    description: 'The ID of the user',
    example: 1
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The user has been successfully deleted.'
  })
  @ApiDeletionErrorResponses()
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usersService.remove(+id);
  }
}
