import { Route, RouteComparison, RouteFilters } from '../domain/Route';
import {
  ComplianceBalance,
  AdjustedComplianceBalance,
  BankEntry,
  Pool,
  PoolMember,
} from '../domain/Compliance';

export interface IApiClient {
  // Routes
  getRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<RouteComparison[]>;

  // Compliance
  computeComplianceBalance(
    shipId: string,
    year: number,
    ghgIntensity: number,
    fuelConsumption: number,
    fuelType: string
  ): Promise<ComplianceBalance>;
  getAdjustedCB(shipId: string, year: number): Promise<AdjustedComplianceBalance>;

  // Banking
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry>;
  applyBanked(shipId: string, year: number, amount: number): Promise<BankEntry>;
  getBankingRecords(shipId: string, year?: number): Promise<{ records: BankEntry[]; totalBanked: number }>;

  // Pooling
  createPool(year: number, members: PoolMember[]): Promise<Pool>;
  getPoolsByYear(year: number): Promise<Pool[]>;
}