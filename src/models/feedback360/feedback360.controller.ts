import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Body,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { Feedback360Service } from './feedback360.service';
import { CreateFeedback360Dto } from './dto/create-feedback360.dto';
import { UpdateFeedback360Dto } from './dto/update-feedback360.dto';
import { Feedback360 } from './entities/feedback360.entity';
import { PUBLIC_SERIALISATION_GROUPS } from 'src/common/serialisation/public.serialisation.preset';

@Controller('feedback360')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Feedback360, groups: PUBLIC_SERIALISATION_GROUPS.BASIC })
export class Feedback360Controller {
  constructor(private readonly feedback360Service: Feedback360Service) {}

  @Post()
  @SerializeOptions({ type: Feedback360, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  create(@Body() createFeedback360Dto: CreateFeedback360Dto) {
    return this.feedback360Service.create(createFeedback360Dto);
  }

  @Get()
  findAll() {
    return this.feedback360Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedback360Service.findOne(+id);
  }

  @Patch(':id')
  @SerializeOptions({ type: Feedback360, groups: PUBLIC_SERIALISATION_GROUPS.SYSTEMIC })
  update(@Param('id') id: string, @Body() updateFeedback360Dto: UpdateFeedback360Dto) {
    return this.feedback360Service.update(+id, updateFeedback360Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedback360Service.remove(+id);
  }
}
