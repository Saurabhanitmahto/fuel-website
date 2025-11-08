import { PrismaClient } from '@prisma/client';
import { BankingRepository, BankEntry } from '../../../core/ports/BankingRepository';

export class BankingRepositoryImpl implements BankingRepository {
  constructor(private prisma: PrismaClient) {}

  async save(entry: Omit<BankEntry, 'id'>): Promise<BankEntry> {
    return this.prisma.bankEntry.create({ data: entry });
  }

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    return this.prisma.bankEntry.findMany({
      where: { shipId, year },
      orderBy: { createdAt: 'asc' }
    });
  }

  async getTotalBanked(shipId: string, upToYear: number): Promise<number> {
    const entries = await this.prisma.bankEntry.findMany({
      where: {
        shipId,
        year: { lte: upToYear }
      }
    });

    return entries.reduce((sum, entry) => sum + entry.amountGco2eq, 0);
  }

  async apply(shipId: string, year: number, amount: number): Promise<BankEntry> {
    return this.prisma.bankEntry.create({
      data: {
        shipId,
        year,
        amountGco2eq: amount
      }
    });
  }
}