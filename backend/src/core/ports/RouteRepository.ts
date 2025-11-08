import { Route } from '../domain/Route';

export interface RouteRepository {
  findAll(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(): Promise<Route | null>;
  setBaseline(routeId: string): Promise<Route>;
  create(route: Omit<Route, 'id'>): Promise<Route>;
}