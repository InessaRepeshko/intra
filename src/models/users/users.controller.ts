import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  SerializeOptions,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PUBLIC_SERIALISATION_GROUPS } from 'src/common/serialisation/public.serialisation.preset';
import {
  ApiCreateAndUpdateErrorResponses,
  ApiDeletionErrorResponses,
  ApiReadErrorResponses,
} from 'src/common/documentation/api.error.responses.decorator';

@Controller('users')
@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: User, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @SerializeOptions({ type: User, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: () => OmitType(User, ['passwordHash', 'createdAt', 'updatedAt']),
  })
  @ApiCreateAndUpdateErrorResponses()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    type: () => [OmitType(User, ['passwordHash', 'createdAt', 'updatedAt'])], 
    isArray: true, 
    description: 'The users have been successfully retrieved.' 
  })
  @ApiReadErrorResponses()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
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
    type: () => OmitType(User, ['passwordHash', 'createdAt', 'updatedAt']), 
    description: 'The user has been successfully retrieved.' 
  })
  @ApiReadErrorResponses()
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  @SerializeOptions({ type: User, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
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
    type: UpdateUserDto, 
    description: 'The user data to update' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    type: () => OmitType(User, ['passwordHash', 'createdAt', 'updatedAt']), 
    description: 'The user has been successfully updated.' 
  })
  @ApiCreateAndUpdateErrorResponses()
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(+id, dto);
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
    return await this.usersService.remove(+id);
  }
}
