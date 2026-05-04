import { Router } from 'express';
import { ContractController } from '../controllers/contract.controller';
import { protectAdminRoute } from '../middleware/auth.middleware';

const router = Router();

// Apply admin protection to all contract routes
router.use(protectAdminRoute);

// Promote contract tier (e.g., Grade B to Grade A)
router.patch('/:playerId/promote', ContractController.promoteContract);

// Adjust specific contract terms
router.patch('/:playerId/terms', ContractController.adjustTerms);

export default router;
