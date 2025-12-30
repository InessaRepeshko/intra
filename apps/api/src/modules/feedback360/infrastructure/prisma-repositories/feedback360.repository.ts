import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Feedback360 } from '../../presentation/http/models/feedback360.entity';
import { feedback360_stage, Prisma } from '@prisma/client';

@Injectable()
export class Feedback360Repository {
  constructor(private readonly db: PrismaService) {}

  async create(data: Prisma.Feedback360UncheckedCreateInput): Promise<Feedback360> {
    return this.db.feedback360.create({ data });
  }

  async findAll(): Promise<Feedback360[]> {
    return this.db.feedback360.findMany();
  }

  async findById(id: number): Promise<Feedback360 | null> {
    return this.db.feedback360.findUnique({ where: { id } });
  }

  async findByRateeId(rateeId: number): Promise<Feedback360[]> {
    return this.db.feedback360.findMany({ where: { rateeId } });
  }

  async findByHrId(hrId: number): Promise<Feedback360[]> {
    return this.db.feedback360.findMany({ where: { hrId } });
  }

  async findByPositionId(positionId: number): Promise<Feedback360[]> {
    return this.db.feedback360.findMany({ where: { positionId } });
  }

  async findByCycleId(cycleId: number): Promise<Feedback360[]> {
    return this.db.feedback360.findMany({ where: { cycleId } });
  }

  async findByReportId(reportId: number): Promise<Feedback360[]> {
    return this.db.feedback360.findMany({ where: { reportId } });
  }

  async findByStage(stage: feedback360_stage): Promise<Feedback360[]> {
    return this.db.feedback360.findMany({ where: { stage } });
  }

  async updateById(id: number, data: Prisma.Feedback360UncheckedUpdateInput): Promise<Feedback360> {
    return this.db.feedback360.update({ where: { id }, data });
  }

  async deleteById(id: number): Promise<Feedback360> {
    return this.db.feedback360.delete({ where: { id } });
  }
}
