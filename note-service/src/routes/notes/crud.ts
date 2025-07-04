// src/routes/notes/crud.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../../generated/client';

const router = Router();
const prisma = new PrismaClient();

// GET /notes?page=1&limit=5
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;

  try {
    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.note.count(),
    ]);

    res.json({
      data: notes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /notes
router.post('/', async (req: Request, res: Response) => {
  const { title, body, startDate, endDate, imageUrl, userId } = req.body;

  if (!title || !body || !startDate || !endDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const note = await prisma.note.create({
      data: {
        title,
        body,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        imageUrl: imageUrl || null,
        userId: userId || 1, // Default userId jika tidak disediakan
      },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;