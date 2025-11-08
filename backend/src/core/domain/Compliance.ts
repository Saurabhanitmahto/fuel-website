export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number;
  ghgIntensity: number;
  energyInScope: number;
  target: number;
  compliant: boolean;
}

export interface AdjustedComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number;
  adjustedCbGco2eq: number;
  bankedAmount: number;
}