export const API_BASE_URL = '/api';

export const GHG_TARGETS = {
  2024: 91.16,
  2025: 89.3368,
  2030: 85.6904,
  2035: 77.9418,
  2040: 62.9004,
  2045: 34.6408,
  2050: 18.2320,
} as const;

export const VESSEL_TYPES = [
  'Container',
  'BulkCarrier',
  'Tanker',
  'RoRo',
  'Passenger',
] as const;

export const FUEL_TYPES = [
  'HFO',
  'LFO',
  'MGO',
  'MDO',
  'LNG',
  'LPG',
  'Methanol',
  'Ammonia',
  'Hydrogen',
] as const;

export const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030] as const;