import { PoolRepository } from '../ports/PoolRepository';
import { ComplianceRepository } from '../ports/ComplianceRepository';
import { Pool, PoolMember, PoolValidation } from '../domain/Pool';
import { roundToDecimals } from '../../shared/utils';

export class PoolingUseCase {
  constructor(
    private poolRepo: PoolRepository,
    private complianceRepo: ComplianceRepository
  ) {}

  async createPool(year: number, members: PoolMember[]): Promise<Pool> {
    // Validate pool
    const validation = await this.validatePool(year, members);
    if (!validation.valid) {
      throw new Error(`Pool validation failed: ${validation.errors.join(', ')}`);
    }

    // Calculate totals
    const totalCbBefore = roundToDecimals(
      members.reduce((sum, m) => sum + m.cbBefore, 0)
    );
    const totalCbAfter = roundToDecimals(
      members.reduce((sum, m) => sum + m.cbAfter, 0)
    );

    const pool: Pool = {
      year,
      members,
      totalCbBefore,
      totalCbAfter,
      valid: true
    };

    return this.poolRepo.create(pool);
  }

  private async validatePool(year: number, members: PoolMember[]): Promise<PoolValidation> {
    const errors: string[] = [];

    // Must have at least 2 members
    if (members.length < 2) {
      errors.push('Pool must have at least 2 members');
    }

    // Calculate total CB
    const totalCbBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
    const totalCbAfter = members.reduce((sum, m) => sum + m.cbAfter, 0);

    // Sum of CB must be >= 0
    if (totalCbBefore < 0) {
      errors.push(`Total CB before pooling is negative: ${totalCbBefore}`);
    }

    // Total CB after must equal total CB before
    if (Math.abs(totalCbAfter - totalCbBefore) > 0.01) {
      errors.push('Total CB after pooling must equal total CB before');
    }

    // Validate each member
    for (const member of members) {
      // Deficit ships cannot exit worse
      if (member.cbBefore < 0 && member.cbAfter < member.cbBefore) {
        errors.push(`Ship ${member.shipId} deficit increased from ${member.cbBefore} to ${member.cbAfter}`);
      }

      // Surplus ships cannot exit negative
      if (member.cbBefore >= 0 && member.cbAfter < 0) {
        errors.push(`Ship ${member.shipId} went from surplus (${member.cbBefore}) to deficit (${member.cbAfter})`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async getPoolsByYear(year: number): Promise<Pool[]> {
    return this.poolRepo.findByYear(year);
  }
}