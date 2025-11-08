import { IApiClient } from '../ports/IApiClient';
import { Pool, PoolMember } from '../domain/Compliance';

export class PoolingUseCase {
  constructor(private apiClient: IApiClient) {}

  async createPool(year: number, members: PoolMember[]): Promise<Pool> {
    return this.apiClient.createPool(year, members);
  }

  async getPoolsByYear(year: number): Promise<Pool[]> {
    return this.apiClient.getPoolsByYear(year);
  }

  validatePool(members: PoolMember[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Must have at least 2 members
    if (members.length < 2) {
      errors.push('Pool must have at least 2 members');
    }

    const totalBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
    const totalAfter = members.reduce((sum, m) => sum + m.cbAfter, 0);

    // Total CB must be >= 0
    if (totalBefore < 0) {
      errors.push('Total CB before pooling must be non-negative');
    }

    // Total must be conserved
    if (Math.abs(totalAfter - totalBefore) > 0.01) {
      errors.push('Total CB after must equal total CB before');
    }

    // Validate each member
    members.forEach((member) => {
      if (member.cbBefore < 0 && member.cbAfter < member.cbBefore) {
        errors.push(`Ship ${member.shipId}: deficit cannot increase`);
      }
      if (member.cbBefore >= 0 && member.cbAfter < 0) {
        errors.push(`Ship ${member.shipId}: cannot go from surplus to deficit`);
      }
    });

    return { valid: errors.length === 0, errors };
  }
}