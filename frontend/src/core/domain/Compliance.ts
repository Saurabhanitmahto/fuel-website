export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number;
  ghgIntensity: number;
  energyInScope: number;
  target: number;
  compliant: boolean;
  penalty?: number;
}

export interface AdjustedComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number;
  adjustedCbGco2eq: number;
  bankedAmount: number;
}

export interface BankEntry {
  id?: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  createdAt?: string;
}

export interface Pool {
  id?: string;
  year: number;
  members: PoolMember[];
  totalCbBefore: number;
  totalCbAfter: number;
  valid: boolean;
}

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}