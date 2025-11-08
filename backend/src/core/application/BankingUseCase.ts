import { BankingRepository } from '../ports/BankingRepository';
import { ComplianceRepository } from '../ports/ComplianceRepository';
import { BankEntry } from '../ports/BankingRepository';
import { roundToDecimals } from '../../shared/utils';

export class BankingUseCase {
  constructor(
    private bankingRepo: BankingRepository,
    private complianceRepo: ComplianceRepository
  ) {}

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry> {
    // Validate that amount is positive
    if (amount <= 0) {
      throw new Error('Banking amount must be positive');
    }

    // Verify ship has sufficient surplus
    const compliance = await this.complianceRepo.findByShipAndYear(shipId, year);
    if (!compliance || compliance.cbGco2eq < amount) {
      throw new Error('Insufficient surplus to bank');
    }

    return this.bankingRepo.save({
      shipId,
      year,
      amountGco2eq: roundToDecimals(amount)
    });
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankEntry> {
    // Validate amount is positive
    if (amount <= 0) {
      throw new Error('Application amount must be positive');
    }

    // Get total available banked amount
    const totalBanked = await this.bankingRepo.getTotalBanked(shipId, year - 1);
    
    if (totalBanked < amount) {
      throw new Error(`Insufficient banked surplus. Available: ${totalBanked}, Requested: ${amount}`);
    }

    // Apply banked amount (stored as negative to indicate usage)
    return this.bankingRepo.apply(shipId, year, roundToDecimals(-amount));
  }

  async getBankedRecords(shipId: string, year?: number): Promise<BankEntry[]> {
    if (year) {
      return this.bankingRepo.findByShipAndYear(shipId, year);
    }
    
    // Get all records if no year specified
    const allRecords: BankEntry[] = [];
    for (let y = 2025; y <= new Date().getFullYear(); y++) {
      const records = await this.bankingRepo.findByShipAndYear(shipId, y);
      allRecords.push(...records);
    }
    return allRecords;
  }
}