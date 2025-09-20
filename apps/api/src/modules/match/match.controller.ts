import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken, AuthRequest } from '@/utils/auth';
import { matchingAgent, MatchingCriteria } from '@/services/matching-agent';
import { logger } from '@/utils/logger';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const matchActionSchema = z.object({
  targetUserId: z.string(),
  action: z.enum(['LIKE', 'PASS', 'SUPER_LIKE']),
  message: z.string().max(500).optional(),
});

// GET /api/match - Get AI-powered matches for current user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.authUser?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Build matching criteria
    const criteria: MatchingCriteria = {
      userId,
      excludeContacted: true,
    };

    // Get AI-powered matches
    const matches = await matchingAgent.findMatches(criteria, 20);

    logger.info(`Generated ${matches.length} matches for user ${userId}`);

    res.json({
      matches: matches.map((match: any) => ({
        id: match.id,
        name: match.name,
        age: match.age,
        location: match.location,
        industry: match.industry,
        stage: match.stage,
        companyName: match.companyName,
        bio: match.bio,
        compatibility: {
          overall: match.compatibility.overall,
          reasons: match.compatibility.reasons,
          recommendations: match.compatibility.recommendations,
        },
      })),
      total: matches.length,
    });

  } catch (error) {
    logger.error('Error getting matches:', error);
    res.status(500).json({ error: 'Failed to get matches' });
  }
});

// POST /api/match/action - Like, pass, or super like a match
router.post('/action', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.authUser?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const validatedData = matchActionSchema.parse(req.body);
    const { targetUserId, action, message } = validatedData;

    // Create match record
    const match = await prisma.match.create({
      data: {
        fromUserId: userId,
        toUserId: targetUserId,
        status: action === 'PASS' ? 'REJECTED' : 'PENDING',
        message: message || null,
        isInterested: action !== 'PASS',
        isSuperLike: action === 'SUPER_LIKE',
      }
    });

    res.json({
      message: action === 'PASS' ? 'Passed on this match' : 'Interest sent successfully',
      match: { id: match.id, action }
    });

  } catch (error) {
    logger.error('Error processing match action:', error);
    res.status(500).json({ error: 'Failed to process match action' });
  }
});

// GET /api/match/compatibility/:userId - Get detailed compatibility analysis
router.get('/compatibility/:userId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.authUser?.id;
    const targetUserId = req.params.userId;

    if (!currentUserId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Get detailed compatibility analysis from AI agent
    const compatibility = await matchingAgent.calculateCompatibility(currentUserId, targetUserId);

    res.json({ compatibility });

  } catch (error) {
    logger.error('Error getting compatibility analysis:', error);
    res.status(500).json({ error: 'Failed to analyze compatibility' });
  }
});

export default router;