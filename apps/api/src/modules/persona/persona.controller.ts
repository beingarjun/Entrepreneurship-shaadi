import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// GET /api/persona
router.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Implement get user persona
    res.json({ message: 'Get user persona - Coming soon' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;