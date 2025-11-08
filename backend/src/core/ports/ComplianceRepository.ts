import { ComplianceBalance, AdjustedComplianceBalance } from '../domain/Compliance';

export interface ComplianceRepository {
  save(compliance: Omit<ComplianceBalance, 'compliant' | 'target'>): Promise<ComplianceBalance>;
  findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
  findByShip(shipId: string): Promise<ComplianceBalance[]>;
}