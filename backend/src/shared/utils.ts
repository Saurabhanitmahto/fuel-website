export function roundToDecimals(value: number, decimals: number = 5): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function getGHGTarget(year: number): number {
  const targets: Record<number, number> = {
    2025: 89.3368,
    2030: 85.6904,
    2035: 77.9418,
    2040: 62.9004,
    2045: 34.6408,
    2050: 18.2320
  };

  // Find the applicable target for the given year
  const years = Object.keys(targets).map(Number).sort((a, b) => a - b);
  
  for (let i = 0; i < years.length; i++) {
    if (year < years[i]) {
      return i === 0 ? targets[years[0]] : targets[years[i - 1]];
    }
  }
  
  return targets[years[years.length - 1]];
}

export function calculateEnergyInScope(fuelConsumption: number, lcv: number): number {
  // fuelConsumption in tonnes, LCV in MJ/g
  // Convert tonnes to grams: tonnes * 1,000,000 = grams
  return fuelConsumption * 1000000 * lcv;
}