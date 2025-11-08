import { Request, Response } from 'express';
import { ComputeCBUseCase } from '../../../core/application/ComputeCBUseCase';
import { ENERGY_CONVERSION_CONSTANT, PENALTY_RATE } from '../../../shared/constants';
import { roundToDecimals } from '../../../shared/utils';

export class ComplianceController {
  constructor(private computeCBUseCase: ComputeCBUseCase) {}

  computeCB = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;
      const { ghgIntensity, fuelConsumption, fuelType } = req.body;

      if (!shipId || !year || !ghgIntensity || !fuelConsumption || !fuelType) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: shipId, year, ghgIntensity, fuelConsumption, fuelType'
        });
      }

      const compliance = await this.computeCBUseCase.execute(
        shipId as string,
        parseInt(year as string),
        parseFloat(ghgIntensity),
        parseFloat(fuelConsumption),
        fuelType
      );

      // Calculate penalty if deficit exists
      let penalty = 0;
      if (compliance.cbGco2eq < 0) {
        const deficitMass = Math.abs(compliance.cbGco2eq);
        const vlsfoEquivalent = deficitMass / (compliance.ghgIntensity * ENERGY_CONVERSION_CONSTANT);
        penalty = Math.round(vlsfoEquivalent * PENALTY_RATE);
      }

      res.json({
        success: true,
        data: {
          ...compliance,
          penalty
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getAdjustedCB = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: shipId, year'
        });
      }

      const adjustedCB = await this.computeCBUseCase.getAdjustedCB(
        shipId as string,
        parseInt(year as string)
      );

      if (!adjustedCB) {
        return res.status(404).json({
          success: false,
          error: 'Compliance balance not found'
        });
      }

      res.json({
        success: true,
        data: adjustedCB
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}