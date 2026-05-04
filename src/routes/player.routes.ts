import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';
import { protectAdminRoute } from '../middleware/auth.middleware';

const router = Router();

// Apply admin protection to all player routes
router.use(protectAdminRoute);

router.post('/', PlayerController.createPlayer);
router.get('/', PlayerController.getAllPlayers);
router.get('/:id', PlayerController.getPlayer);
router.put('/:id', PlayerController.updatePlayer);
router.delete('/:id', PlayerController.deletePlayer);

export default router;
