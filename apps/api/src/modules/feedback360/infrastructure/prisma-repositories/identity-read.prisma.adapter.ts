import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IdentityReadPort } from '../../application/external-ports/identity-read.port';

@Injectable()
export class IdentityReadPrismaAdapter implements IdentityReadPort {
  constructor(private readonly db: PrismaService) {}

  async userExists(userId: number): Promise<boolean> {
    const found = await this.db.user.findUnique({ where: { id: userId }, select: { id: true } });
    return Boolean(found);
  }

  async positionExists(positionId: number): Promise<boolean> {
    const found = await this.db.position.findUnique({ where: { id: positionId }, select: { id: true } });
    return Boolean(found);
  }
}


