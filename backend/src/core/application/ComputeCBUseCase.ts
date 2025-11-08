import { ComplianceRepository } from '../ports/ComplianceRepository';
import { BankingRepository } from '../ports/BankingRepository';
import { ComplianceBalance, AdjustedComplianceBalance } from '../domain/Compliance';
import { getGHGTarget, calculateEnergyInScope, roundToDecimals } from '../../shared/utils';
import { LCV_VALUES } from '../../shared/constants';

export class ComputeCBUseCase {
  constructor(
    private complianceRepo: ComplianceRepository,
    private bankingRepo: BankingRepository
  ) {}

  async execute(
    shipId: string,
    year: number,
    ghgIntensity: number,
    fuelConsumption: number,
    fuelType: string
  ): Promise<ComplianceBalance> {
    const target = getGHGTarget(year);
    
    // Get LCV for fuel type
    const lcvKey = fuelType.toUpperCase().replace(/[- ]/g, '_') as keyof typeof LCV_VALUES;
    const lcv = LCV_VALUES[lcvKey] || LCV_VALUES.MGO; // Default to MGO if not found
    
    // Calculate energy in scope (MJ)
    const energyInScope = calculateEnergyInScope(fuelConsumption, lcv);
    
    // Calculate compliance balance: (target - actual) * energy
    const cbGco2eq = roundToDecimals((target - ghgIntensity) * energyInScope);
    
    const compliance: ComplianceBalance = {
      shipId,
      year,
      cbGco2eq,
      ghgIntensity: roundToDecimals(ghgIntensity),
      energyInScope: roundToDecimals(energyInScope),
      target,
      compliant: cbGco2eq >= 0
    };

    // Save to database
    await this.complianceRepo.save({
      shipId,
      year,
      cbGco2eq,
      ghgIntensity: compliance.ghgIntensity,
      energyInScope: compliance.energyInScope
    });

    return compliance;
  }

  async getAdjustedCB(shipId: string, year: number): Promise<AdjustedComplianceBalance | null> {
    const compliance = await this.complianceRepo.findByShipAndYear(shipId, year);
    if (!compliance) return null;

    const bankedAmount = await this.bankingRepo.getTotalBanked(shipId, year - 1);
    const adjustedCbGco2eq = roundToDecimals(compliance.cbGco2eq + bankedAmount);

    return {
      shipId,
      year,
      cbGco2eq: compliance.cbGco2eq,
      adjustedCbGco2eq,
      bankedAmount
    };
  }
}