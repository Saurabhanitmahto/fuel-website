import { IApiClient } from '../ports/IApiClient';
import { Route, RouteFilters } from '../domain/Route';

export class FetchRoutesUseCase {
  constructor(private apiClient: IApiClient) {}

  async execute(filters?: RouteFilters): Promise<Route[]> {
    return this.apiClient.getRoutes(filters);
  }
}