// FuelEU Maritime GHG Intensity Targets (gCO2eq/MJ)
export const GHG_TARGETS = {
  2025: 89.3368,  // -2%
  2030: 85.6904,  // -6%
  2035: 77.9418,  // -14.5%
  2040: 62.9004,  // -31%
  2045: 34.6408,  // -62%
  2050: 18.2320   // -80%
} as const;

// Energy conversion constant (MJ/tonne VLSFO)
export const ENERGY_CONVERSION_CONSTANT = 41000;

// Penalty rate (EUR/tonne VLSFO equivalent)
export const PENALTY_RATE = 2400;

// Lower Calorific Values (MJ/g)
export const LCV_VALUES = {
  HFO: 0.0405,
  LFO: 0.0410,
  MGO: 0.0427,
  MDO: 0.0427,
  LNG: 0.0491,
  LPG_BUTANE: 0.0460,
  LPG_PROPANE: 0.0460,
  METHANOL: 0.0199,
  AMMONIA: 0.0186,
  HYDROGEN: 0.1200
} as const;