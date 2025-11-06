import express from 'express';
import { 
  getEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  updateEventStatus 
} from '../controllers/events.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createEventSchema, updateEventSchema, updateEventStatusSchema } from '../utils/validation.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getEvents);
router.post('/', validate(createEventSchema), createEvent);
router.put('/:id', validate(updateEventSchema), updateEvent);
router.delete('/:id', deleteEvent);
router.patch('/:id/status', validate(updateEventStatusSchema), updateEventStatus);

export default router;