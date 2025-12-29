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
  NotFoundException,
} from '@nestjs/common';
import { UsersApplicationService } from '../../application/users.application-service';
import { CreateUserHttpDto } from './dto/create-user.http.dto';
import { UpdateUserHttpDto } from './dto/update-user.http.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { UserResponse } from './presenters/user.response';
import { UserResponseMapper } from './presenters/user-response.mapper';
import { PUBLIC_SERIALISATION_GROUPS } from 'src/common/serialisation/public.serialisation.preset';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiListReadErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';

@Controller('users')
@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserResponse, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class UsersController {
  constructor(private readonly usersService: UsersApplicationService) { }

  @Post()
  @SerializeOptions({ type: UserResponse, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserHttpDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: () => OmitType(UserResponse, ['passwordHash', 'createdAt', 'updatedAt']),
  })
  @ApiCreateAndUpdateErrorResponses()
  async create(@Body() dto: CreateUserHttpDto): Promise<UserResponse> {
    const created = await this.usersService.create(dto);
    return UserResponseMapper.toResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    type: () => [OmitType(UserResponse, ['passwordHash', 'createdAt', 'updatedAt'])], 
    isArray: true, 
    description: 'The users have been successfully retrieved.' 
  })
  @ApiListReadErrorResponses()
  async findAll(): Promise<UserResponse[]> {
    const users = await this.usersService.findAll();
    return users.map(UserResponseMapper.toResponse);
  }

  @Get('by-email')
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiQuery({
    required: true,
    name: 'email',
    type: 'string',
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully retrieved.',
    type: () => OmitType(UserResponse, ['passwordHash', 'createdAt', 'updatedAt']),
  })
  @ApiReadErrorResponses()
  async findByEmail(@Query('email') email: string): Promise<UserResponse> {
    try {
      const user = await this.usersService.findByEmail(email);
      return UserResponseMapper.toResponse(user);
    } catch (e) {
      if (e instanceof UserNotFoundError) throw new NotFoundException('User not found');
      throw e;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ 
    required: true, 
    name: 'id', 
    type: 'number', 
    description: 'The ID of the user', 
    example: 1 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    type: () => OmitType(UserResponse, ['passwordHash', 'createdAt', 'updatedAt']), 
    description: 'The user has been successfully retrieved.' 
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    try {
      const user = await this.usersService.findOne(+id);
      return UserResponseMapper.toResponse(user);
    } catch (e) {
      if (e instanceof UserNotFoundError) throw new NotFoundException('User not found');
      throw e;
    }
  }

  @Patch(':id')
  @SerializeOptions({ type: UserResponse, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ 
    required: true, 
    name: 'id', 
    type: 'number', 
    description: 'The ID of the user', 
    example: 1 
  })
  @ApiBody({ 
    required: true, 
    type: UpdateUserHttpDto, 
    description: 'The user data to update' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    type: () => OmitType(UserResponse, ['passwordHash', 'createdAt', 'updatedAt']), 
    description: 'The user has been successfully updated.' 
  })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateUserHttpDto): Promise<UserResponse> {
    try {
      const updated = await this.usersService.update(+id, dto);
      return UserResponseMapper.toResponse(updated);
    } catch (e) {
      if (e instanceof UserNotFoundError) throw new NotFoundException('User not found');
      throw e;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by ID' })
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
    try {
      return await this.usersService.remove(+id);
    } catch (e) {
      if (e instanceof UserNotFoundError) throw new NotFoundException('User not found');
      throw e;
    }
  }
}
