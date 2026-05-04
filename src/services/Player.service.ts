import { prisma } from '../config/prisma';
import { NotFoundError } from '../utils/errors';
import { Player, Prisma } from '@prisma/client';

export class PlayerService {
  static async createPlayer(data: Prisma.PlayerCreateInput): Promise<Player> {
    return prisma.player.create({
      data,
    });
  }

  static async getPlayerById(id: string): Promise<Player> {
    const player = await prisma.player.findUnique({
      where: { id },
      include: { contract: true },
    });

    if (!player) {
      throw new NotFoundError(`Player with ID ${id} not found`);
    }

    return player;
  }

  static async getAllPlayers(): Promise<Player[]> {
    return prisma.player.findMany({
      include: { contract: true },
    });
  }

  static async updatePlayer(id: string, data: Prisma.PlayerUpdateInput): Promise<Player> {
    const existingPlayer = await prisma.player.findUnique({ where: { id } });
    if (!existingPlayer) {
      throw new NotFoundError(`Player with ID ${id} not found`);
    }

    return prisma.player.update({
      where: { id },
      data,
    });
  }

  static async deletePlayer(id: string): Promise<Player> {
    const existingPlayer = await prisma.player.findUnique({ where: { id } });
    if (!existingPlayer) {
      throw new NotFoundError(`Player with ID ${id} not found`);
    }

    return prisma.player.delete({
      where: { id },
    });
  }
}
