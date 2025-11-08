import { PrismaClient } from '@prisma/client';
import { ComplianceRepository } from '../../../core/ports/ComplianceRepository';
import { ComplianceBalance } from '../../../core/domain/Compliance';
import { getGHGTarget } from '../../../shared/utils';

export class ComplianceRepositoryImpl implements ComplianceRepository {
  constructor(private prisma: PrismaClient) {}

  async save(compliance: Omit<ComplianceBalance, 'compliant' | 'target'>): Promise<ComplianceBalance> {
    const saved = await this.prisma.shipCompliance.upsert({
      where: {
        shipId_year: {
          shipId: compliance.shipId,
          year: compliance.year
        }
      },
      update: {
        cbGco2eq: compliance.cbGco2eq,
        ghgIntensity: compliance.ghgIntensity,
        energyInScope: compliance.energyInScope
      },
      create: compliance
    });

    const target = getGHGTarget(saved.year);
    
    return {
      ...saved,
      target,
      compliant: saved.cbGco2eq >= 0
    };
  }

  async findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const result = await this.prisma.shipCompliance.findUnique({
      where: {
        shipId_year: { shipId, year }
      }
    });

    if (!result) return null;

    const target = getGHGTarget(result.year);
    
    return {
      ...result,
      target,
      compliant: result.cbGco2eq >= 0
    };
  }

  async findByShip(shipId: string): Promise<ComplianceBalance[]> {
    const results = await this.prisma.shipCompliance.findMany({
      where: { shipId },
      orderBy: { year: 'asc' }
    });

    return results.map(result => {
      const target = getGHGTarget(result.year);
      return {
        ...result,
        target,
        compliant: result.cbGco2eq >= 0
      };
    });
  }
}