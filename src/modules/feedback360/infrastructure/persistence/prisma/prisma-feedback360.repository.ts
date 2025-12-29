import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/infrastructure/database/database.service';
import { Feedback360Repository } from '../../../domain/repositories/feedback360.repository';
import { CreateFeedback360Data, Feedback360, Feedback360Stage, UpdateFeedback360Data } from '../../../domain/model/feedback360';
import { PrismaFeedback360PersistenceMapper } from './prisma-feedback360.persistence-mapper';

@Injectable()
export class PrismaFeedback360Repository implements Feedback360Repository {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateFeedback360Data): Promise<Feedback360> {
    const created = await this.db.feedback360.create({ data: PrismaFeedback360PersistenceMapper.toPrismaCreate(data) });
    return PrismaFeedback360PersistenceMapper.toDomain(created);
  }

  async findAll(): Promise<Feedback360[]> {
    const items = await this.db.feedback360.findMany();
    return items.map(PrismaFeedback360PersistenceMapper.toDomain);
  }

  async findById(id: number): Promise<Feedback360 | null> {
    const item = await this.db.feedback360.findUnique({ where: { id } });
    return item ? PrismaFeedback360PersistenceMapper.toDomain(item) : null;
  }

  async findByRateeId(rateeId: number): Promise<Feedback360[]> {
    const items = await this.db.feedback360.findMany({ where: { rateeId } });
    return items.map(PrismaFeedback360PersistenceMapper.toDomain);
  }

  async findByHrId(hrId: number): Promise<Feedback360[]> {
    const items = await this.db.feedback360.findMany({ where: { hrId } });
    return items.map(PrismaFeedback360PersistenceMapper.toDomain);
  }

  async findByPositionId(positionId: number): Promise<Feedback360[]> {
    const items = await this.db.feedback360.findMany({ where: { positionId } });
    return items.map(PrismaFeedback360PersistenceMapper.toDomain);
  }

  async findByCycleId(cycleId: number): Promise<Feedback360[]> {
    const items = await this.db.feedback360.findMany({ where: { cycleId } });
    return items.map(PrismaFeedback360PersistenceMapper.toDomain);
  }

  async findByReportId(reportId: number): Promise<Feedback360[]> {
    const items = await this.db.feedback360.findMany({ where: { reportId } });
    return items.map(PrismaFeedback360PersistenceMapper.toDomain);
  }

  async findByStage(stage: Feedback360Stage): Promise<Feedback360[]> {
    const items = await this.db.feedback360.findMany({ where: { stage: stage as any } });
    return items.map(PrismaFeedback360PersistenceMapper.toDomain);
  }

  async updateById(id: number, data: UpdateFeedback360Data): Promise<Feedback360> {
    const updated = await this.db.feedback360.update({
      where: { id },
      data: PrismaFeedback360PersistenceMapper.toPrismaUpdate(data),
    });
    return PrismaFeedback360PersistenceMapper.toDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.db.feedback360.delete({ where: { id } });
  }
}


