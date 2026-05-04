import { Request, Response, NextFunction } from 'express';
import { ContractService } from '../services/Contract.service';
import { ContractGrade } from '@prisma/client';

export class ContractController {
  static async promoteContract(req: Request, res: Response, next: NextFunction) {
    try {
      const { playerId } = req.params;
      const { newGrade } = req.body;

      if (!Object.values(ContractGrade).includes(newGrade)) {
        return res.status(400).json({ success: false, error: 'Invalid Contract Grade' });
      }

      const updatedContract = await ContractService.promoteContract(playerId, newGrade as ContractGrade);
      res.status(200).json({ success: true, data: updatedContract });
    } catch (error) {
      next(error);
    }
  }

  static async adjustTerms(req: Request, res: Response, next: NextFunction) {
    try {
      const { playerId } = req.params;
      const { baseSalary, matchFee, renewalDate } = req.body;

      const updatedContract = await ContractService.adjustContractTerms(playerId, {
        baseSalary,
        matchFee,
        renewalDate: renewalDate ? new Date(renewalDate) : undefined,
      });

      res.status(200).json({ success: true, data: updatedContract });
    } catch (error) {
      next(error);
    }
  }
}
