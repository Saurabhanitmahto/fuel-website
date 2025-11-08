import { IApiClient } from '../ports/IApiClient';
import { RouteComparison } from '../domain/Route';

export class CompareRoutesUseCase {
  constructor(private apiClient: IApiClient) {}

  async execute(): Promise<RouteComparison[]> {
    return this.apiClient.getComparison();
  }
}