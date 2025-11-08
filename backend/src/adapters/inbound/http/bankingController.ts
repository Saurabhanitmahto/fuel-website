import { Request, Response } from 'express';
import { BankingUseCase } from '../../../core/application/BankingUseCase';

export class BankingController {
  constructor(private bankingUseCase: BankingUseCase) {}

  bank = async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: shipId, year, amount'
        });
      }

      const entry = await this.bankingUseCase.bankSurplus(
        shipId,
        parseInt(year),
        parseFloat(amount)
      );

      res.json({
        success: true,
        data: entry,
        message: 'Surplus banked successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  apply = async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: shipId, year, amount'
        });
      }

      const entry = await this.bankingUseCase.applyBanked(
        shipId,
        parseInt(year),
        parseFloat(amount)
      );

      res.json({
        success: true,
        data: entry,
        message: 'Banked surplus applied successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getRecords = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: shipId'
        });
      }

      const records = await this.bankingUseCase.getBankedRecords(
        shipId as string,
        year ? parseInt(year as string) : undefined
      );

      const totalBanked = records.reduce((sum, r) => sum + r.amountGco2eq, 0);

      res.json({
        success: true,
        data: {
          records,
          totalBanked
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}