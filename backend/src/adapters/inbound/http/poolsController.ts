import { Request, Response } from 'express';
import { PoolingUseCase } from '../../../core/application/PoolingUseCase';

export class PoolsController {
  constructor(private poolingUseCase: PoolingUseCase) {}

  createPool = async (req: Request, res: Response) => {
    try {
      const { year, members } = req.body;

      if (!year || !members || !Array.isArray(members)) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: year, members (array)'
        });
      }

      // Validate members structure
      for (const member of members) {
        if (!member.shipId || member.cbBefore === undefined || member.cbAfter === undefined) {
          return res.status(400).json({
            success: false,
            error: 'Each member must have: shipId, cbBefore, cbAfter'
          });
        }
      }

      const pool = await this.poolingUseCase.createPool(parseInt(year), members);

      res.json({
        success: true,
        data: pool,
        message: 'Pool created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getPoolsByYear = async (req: Request, res: Response) => {
    try {
      const { year } = req.query;

      if (!year) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: year'
        });
      }

      const pools = await this.poolingUseCase.getPoolsByYear(parseInt(year as string));

      res.json({
        success: true,
        data: pools
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}