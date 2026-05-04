import { prisma } from '../config/prisma';
import { MatchLog } from '../models/mongodb/MatchLog';
import { NotFoundError } from '../utils/errors';

export const resolvers = {
  Query: {
    getPlayerProfile: async (_: any, { id }: { id: string }) => {
      // Execute parallel queries against PostgreSQL (Prisma) and MongoDB (Mongoose)
      const [playerData, recentMatchLogs] = await Promise.all([
        prisma.player.findUnique({
          where: { id },
          include: { contract: true },
        }),
        MatchLog.find({
          $or: [{ batsmanId: id }, { bowlerId: id }],
        })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(), // lean() for faster execution, returns plain JS objects
      ]);

      if (!playerData) {
        throw new NotFoundError(`Player with ID ${id} not found`);
      }

      // Map MongoDB _id to id for GraphQL compatibility, though lean() keeps _id
      const formattedLogs = recentMatchLogs.map((log: any) => ({
        ...log,
        id: log._id.toString(),
      }));

      // Return the aggregated PlayerProfile object
      return {
        id: playerData.id,
        name: playerData.name,
        dateOfBirth: playerData.dateOfBirth,
        nationality: playerData.nationality,
        role: playerData.role,
        contract: playerData.contract ? {
          id: playerData.contract.id,
          grade: playerData.contract.grade,
          baseSalary: playerData.contract.baseSalary ? Number(playerData.contract.baseSalary) : 0,
          matchFee: playerData.contract.matchFee ? Number(playerData.contract.matchFee) : 0,
          renewalDate: playerData.contract.renewalDate,
        } : null,
        recentMatches: formattedLogs,
      };
    },
  },
};
