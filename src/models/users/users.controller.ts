import {
  Controller,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Get,
  Query,
  HttpStatus, NotFoundException,
  Delete,
} from '@nestjs/common';import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  OmitType,
  ApiQuery,
  getSchemaPath,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiConflictResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The user has been successfully created.', type: User })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, type: () => OmitType(User, ['passwordHash']), isArray: true, description: 'The users have been successfully retrieved.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'The ID of the user', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, type: () => OmitType(User, ['passwordHash']), description: 'The user has been successfully retrieved.' })
  // @ApiNotFoundResponse({ description: 'User not found' })
  // @ApiBadRequestResponse({ description: 'Invalid ID format' })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // @ApiForbiddenResponse({ description: 'Forbidden' })
  // @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  // @ApiConflictResponse({ description: 'Conflict' })
  // @ApiTooManyRequestsResponse({ description: 'Too many requests' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ required: true, name: 'id', type: 'number', description: 'The ID of the user', example: 1 })
  @ApiBody({ required: true, type: UpdateUserDto, description: 'The user data to update' })
  @ApiResponse({ status: HttpStatus.OK, type: () => OmitType(User, ['passwordHash']), description: 'The user has been successfully updated.' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(+id, dto);
  }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a user by ID' })
  // @ApiParam({ required: true, name: 'id', type: 'number', description: 'The ID of the user', example: 1 })
  // @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The user has been successfully deleted.' })
  // @ApiNotFoundResponse({ description: 'User not found' })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // async remove(@Param('id') id: string): Promise<void> {
  //   return await this.usersService.remove(+id);
  // }
}
