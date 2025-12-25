import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedback360Dto } from './dto/create-feedback360.dto';
import { UpdateFeedback360Dto } from './dto/update-feedback360.dto';
import { Feedback360Repository } from './feedback360.repository';
import { Feedback360 } from './entities/feedback360.entity';
import { feedback360_stage } from '@prisma/client';
import { Feedback360Mapper } from './domain/feedback360.mapper';

@Injectable()
export class Feedback360Service {
  constructor(private readonly repo: Feedback360Repository) { }

  async create(dto: CreateFeedback360Dto): Promise<Feedback360> {
    const feedback = Feedback360Mapper.fromCreateDto(dto);
    return await this.repo.create(Feedback360Mapper.toPrismaCreate(feedback));
  }

  async findAll(): Promise<Feedback360[]> {
    return await this.repo.findAll();
  }

  async findOne(id: number): Promise<Feedback360> {
    const found = await this.repo.findById(id);
    if (!found) throw new NotFoundException('Feedback360 not found');
    return found;
  }

  async findByRateeId(rateeId: number): Promise<Feedback360[]> {
    return await this.repo.findByRateeId(rateeId);
  }

  async findByHrId(hrId: number): Promise<Feedback360[]> {
    return await this.repo.findByHrId(hrId);
  }

  async findByPositionId(positionId: number): Promise<Feedback360[]> {
    return await this.repo.findByPositionId(positionId);
  }

  async findByCycleId(cycleId: number): Promise<Feedback360[]> {
    return await this.repo.findByCycleId(cycleId);
  }

  async findByReportId(reportId: number): Promise<Feedback360[]> {
    return await this.repo.findByReportId(reportId);
  }

  async findByStage(stage: feedback360_stage): Promise<Feedback360[]> {
    return await this.repo.findByStage(stage);
  }

  async update(id: number, dto: UpdateFeedback360Dto): Promise<Feedback360> {
    await this.findOne(id);
    const patch = Feedback360Mapper.fromUpdateDto(dto);
    return await this.repo.updateById(id, Feedback360Mapper.toPrismaUpdate(patch));
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.deleteById(id);
  }
}
