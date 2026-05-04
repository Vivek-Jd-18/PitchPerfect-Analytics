import { Request, Response, NextFunction } from 'express';
import { PlayerService } from '../services/Player.service';
import { AppError } from '../utils/errors';

export class PlayerController {
  static async createPlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const player = await PlayerService.createPlayer(req.body);
      res.status(201).json({ success: true, data: player });
    } catch (error) {
      next(error);
    }
  }

  static async getPlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const player = await PlayerService.getPlayerById(req.params.id);
      res.status(200).json({ success: true, data: player });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPlayers(req: Request, res: Response, next: NextFunction) {
    try {
      const players = await PlayerService.getAllPlayers();
      res.status(200).json({ success: true, count: players.length, data: players });
    } catch (error) {
      next(error);
    }
  }

  static async updatePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const player = await PlayerService.updatePlayer(req.params.id, req.body);
      res.status(200).json({ success: true, data: player });
    } catch (error) {
      next(error);
    }
  }

  static async deletePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      await PlayerService.deletePlayer(req.params.id);
      res.status(200).json({ success: true, message: 'Player deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
