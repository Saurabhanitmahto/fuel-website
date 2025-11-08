import { IApiClient } from '../../core/ports/IApiClient';
import {
  Route,
  RouteComparison,
  RouteFilters,
} from '../../core/domain/Route';
import {
  ComplianceBalance,
  AdjustedComplianceBalance,
  BankEntry,
  Pool,
  PoolMember,
} from '../../core/domain/Compliance';
import { API_BASE_URL } from '../../shared/constants';

export class ApiClient implements IApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data;
  }

  // Routes
  async getRoutes(filters?: RouteFilters): Promise<Route[]> {
    const params = new URLSearchParams();
    if (filters?.vesselType) params.append('vesselType', filters.vesselType);
    if (filters?.fuelType) params.append('fuelType', filters.fuelType);
    if (filters?.year) params.append('year', filters.year.toString());

    const query = params.toString();
    return this.request<Route[]>(`/routes${query ? `?${query}` : ''}`);
  }

  async setBaseline(routeId: string): Promise<Route> {
    return this.request<Route>(`/routes/${routeId}/baseline`, {
      method: 'POST',
    });
  }

  async getComparison(): Promise<RouteComparison[]> {
    return this.request<RouteComparison[]>('/routes/comparison');
  }

  // Compliance
  async computeComplianceBalance(
    shipId: string,
    year: number,
    ghgIntensity: number,
    fuelConsumption: number,
    fuelType: string
  ): Promise<ComplianceBalance> {
    return this.request<ComplianceBalance>(
      `/compliance/cb?shipId=${shipId}&year=${year}`,
      {
        method: 'POST',
        body: JSON.stringify({ ghgIntensity, fuelConsumption, fuelType }),
      }
    );
  }

  async getAdjustedCB(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance> {
    return this.request<AdjustedComplianceBalance>(
      `/compliance/adjusted-cb?shipId=${shipId}&year=${year}`
    );
  }

  // Banking
  async bankSurplus(
    shipId: string,
    year: number,
    amount: number
  ): Promise<BankEntry> {
    return this.request<BankEntry>('/banking/bank', {
      method: 'POST',
      body: JSON.stringify({ shipId, year, amount }),
    });
  }

  async applyBanked(
    shipId: string,
    year: number,
    amount: number
  ): Promise<BankEntry> {
    return this.request<BankEntry>('/banking/apply', {
      method: 'POST',
      body: JSON.stringify({ shipId, year, amount }),
    });
  }

  async getBankingRecords(
    shipId: string,
    year?: number
  ): Promise<{ records: BankEntry[]; totalBanked: number }> {
    const params = new URLSearchParams({ shipId });
    if (year) params.append('year', year.toString());
    return this.request<{ records: BankEntry[]; totalBanked: number }>(
      `/banking/records?${params.toString()}`
    );
  }

  // Pooling
  async createPool(year: number, members: PoolMember[]): Promise<Pool> {
    return this.request<Pool>('/pools', {
      method: 'POST',
      body: JSON.stringify({ year, members }),
    });
  }

  async getPoolsByYear(year: number): Promise<Pool[]> {
    return this.request<Pool[]>(`/pools?year=${year}`);
  }
}