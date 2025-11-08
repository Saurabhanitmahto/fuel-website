export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M';
  }
  if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(2) + 'K';
  }
  return value.toFixed(2);
}

export function getComplianceStatus(cb: number): {
  status: 'surplus' | 'deficit' | 'neutral';
  label: string;
  color: string;
} {
  if (cb > 0) {
    return { status: 'surplus', label: 'Surplus', color: 'text-green-600' };
  }
  if (cb < 0) {
    return { status: 'deficit', label: 'Deficit', color: 'text-red-600' };
  }
  return { status: 'neutral', label: 'Neutral', color: 'text-gray-600' };
}

export function getGHGTarget(year: number): number {
  const targets: Record<number, number> = {
    2024: 91.16,
    2025: 89.3368,
    2030: 85.6904,
    2035: 77.9418,
    2040: 62.9004,
    2045: 34.6408,
    2050: 18.2320,
  };

  const years = Object.keys(targets).map(Number).sort((a, b) => a - b);
  
  for (let i = 0; i < years.length; i++) {
    if (year < years[i]) {
      return i === 0 ? targets[years[0]] : targets[years[i - 1]];
    }
  }
  
  return targets[years[years.length - 1]];
}