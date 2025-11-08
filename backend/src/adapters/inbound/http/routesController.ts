import { Request, Response } from 'express';
import { RouteRepository } from '../../../core/ports/RouteRepository';
import { CompareRoutesUseCase } from '../../../core/application/CompareRoutesUseCase';

export class RoutesController {
  constructor(
    private routeRepo: RouteRepository,
    private compareRoutesUseCase: CompareRoutesUseCase
  ) {}

  getRoutes = async (req: Request, res: Response) => {
    try {
      const { vesselType, fuelType, year } = req.query;
      
      const filters: any = {};
      if (vesselType) filters.vesselType = vesselType as string;
      if (fuelType) filters.fuelType = fuelType as string;
      if (year) filters.year = parseInt(year as string);

      const routes = await this.routeRepo.findAll(filters);
      
      res.json({
        success: true,
        data: routes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  setBaseline = async (req: Request, res: Response) => {
    try {
      const { routeId } = req.params;
      
      const route = await this.routeRepo.setBaseline(routeId);
      
      res.json({
        success: true,
        data: route,
        message: `Route ${routeId} set as baseline`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getComparison = async (req: Request, res: Response) => {
    try {
      const comparisons = await this.compareRoutesUseCase.execute();
      
      res.json({
        success: true,
        data: comparisons
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}