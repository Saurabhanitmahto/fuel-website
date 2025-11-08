export interface BankEntry {
  id?: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
}

export interface BankingRepository {
  save(entry: Omit<BankEntry, 'id'>): Promise<BankEntry>;
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  getTotalBanked(shipId: string, upToYear: number): Promise<number>;
  apply(shipId: string, year: number, amount: number): Promise<BankEntry>;
}