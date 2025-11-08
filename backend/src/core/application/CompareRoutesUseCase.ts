import { RouteRepository } from '../ports/RouteRepository';
import { RouteComparison } from '../domain/Route';
import { getGHGTarget, roundToDecimals } from '../../shared/utils';

export class CompareRoutesUseCase {
  constructor(private routeRepo: RouteRepository) {}

  async execute(): Promise<RouteComparison[]> {
    const baseline = await this.routeRepo.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route set');
    }

    const allRoutes = await this.routeRepo.findAll();
    const comparisons: RouteComparison[] = [];

    for (const route of allRoutes) {
      const target = getGHGTarget(route.year);
      const percentDiff = roundToDecimals(
        ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100
      );
      
      comparisons.push({
        routeId: route.routeId,
        vesselType: route.vesselType,
        fuelType: route.fuelType,
        year: route.year,
        baselineGhgIntensity: baseline.ghgIntensity,
        comparisonGhgIntensity: route.ghgIntensity,
        percentDiff,
        compliant: route.ghgIntensity <= target,
        target
      });
    }

    return comparisons;
  }
}