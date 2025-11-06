import express from 'express';
import { 
  getSwappableSlots, 
  createSwapRequest, 
  respondToSwapRequest,
  getIncomingRequests,
  getOutgoingRequests
} from '../controllers/swap.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createSwapRequestSchema, swapResponseSchema } from '../utils/validation.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/swappable-slots', getSwappableSlots);
router.post('/swap-request', validate(createSwapRequestSchema), createSwapRequest);
router.post('/swap-response/:requestId', validate(swapResponseSchema), respondToSwapRequest);
router.get('/requests/incoming', getIncomingRequests);
router.get('/requests/outgoing', getOutgoingRequests);

export default router;