import { prisma } from '../config/prisma';
import { NotFoundError, ValidationError } from '../utils/errors';
import { Contract, ContractGrade } from '@prisma/client';

export class ContractService {
  static async promoteContract(playerId: string, newGrade: ContractGrade): Promise<Contract> {
    const contract = await prisma.contract.findUnique({
      where: { playerId },
    });

    if (!contract) {
      throw new NotFoundError(`Contract for Player ID ${playerId} not found`);
    }

    // Optional validation logic: Prevent downgrading via promote endpoint, etc.
    const grades = [ContractGrade.C, ContractGrade.B, ContractGrade.A];
    const currentIndex = grades.indexOf(contract.grade);
    const newIndex = grades.indexOf(newGrade);

    if (newIndex <= currentIndex) {
      throw new ValidationError(`Cannot promote to ${newGrade} from ${contract.grade}`);
    }

    // In a real scenario, this might also bump baseSalary and matchFee based on tier configs
    return prisma.contract.update({
      where: { playerId },
      data: {
        grade: newGrade,
        // Mock adjustments based on grade
        baseSalary: newGrade === 'A' ? 1000000 : newGrade === 'B' ? 500000 : 250000,
        matchFee: newGrade === 'A' ? 20000 : newGrade === 'B' ? 10000 : 5000,
      },
    });
  }

  static async adjustContractTerms(
    playerId: string,
    updates: { baseSalary?: number; matchFee?: number; renewalDate?: Date }
  ): Promise<Contract> {
    const contract = await prisma.contract.findUnique({
      where: { playerId },
    });

    if (!contract) {
      throw new NotFoundError(`Contract for Player ID ${playerId} not found`);
    }

    return prisma.contract.update({
      where: { playerId },
      data: updates,
    });
  }
}
