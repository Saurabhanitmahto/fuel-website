import { IApiClient } from '../ports/IApiClient';
import { BankEntry } from '../domain/Compliance';

export class BankingUseCase {
  constructor(private apiClient: IApiClient) {}

  async bank(shipId: string, year: number, amount: number): Promise<BankEntry> {
    return this.apiClient.bankSurplus(shipId, year, amount);
  }

  async apply(shipId: string, year: number, amount: number): Promise<BankEntry> {
    return this.apiClient.applyBanked(shipId, year, amount);
  }

  async getRecords(shipId: string, year?: number) {
    return this.apiClient.getBankingRecords(shipId, year);
  }
}