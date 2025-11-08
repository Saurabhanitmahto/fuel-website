import { PrismaClient } from '@prisma/client';
import { RouteRepository } from '../../../core/ports/RouteRepository';
import { Route } from '../../../core/domain/Route';

export class RouteRepositoryImpl implements RouteRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
    return this.prisma.route.findMany({
      where: {
        vesselType: filters?.vesselType,
        fuelType: filters?.fuelType,
        year: filters?.year
      },
      orderBy: { routeId: 'asc' }
    });
  }

  async findById(id: string): Promise<Route | null> {
    return this.prisma.route.findUnique({ where: { id } });
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    return this.prisma.route.findUnique({ where: { routeId } });
  }

  async findBaseline(): Promise<Route | null> {
    return this.prisma.route.findFirst({ where: { isBaseline: true } });
  }

  async setBaseline(routeId: string): Promise<Route> {
    // First, unset all baselines
    await this.prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false }
    });

    // Then set the new baseline
    return this.prisma.route.update({
      where: { routeId },
      data: { isBaseline: true }
    });
  }

  async create(route: Omit<Route, 'id'>): Promise<Route> {
    return this.prisma.route.create({ data: route });
  }
}