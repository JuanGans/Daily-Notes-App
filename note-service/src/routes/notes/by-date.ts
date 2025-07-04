import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../../generated/client';

const router = Router();
const prisma = new PrismaClient();

// GET /notes/by-date?date=2025-07-03
router.get('/by-date', async (req: Request, res: Response) => {
  const date = req.query.date as string;

  try {
    const notes = await prisma.note.findMany({
      where: {
        startDate: {
          lte: new Date(date),
        },
        endDate: {
          gte: new Date(date),
        },
      },
    });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
