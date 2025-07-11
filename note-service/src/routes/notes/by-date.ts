// by-date.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../../generated/client';

const router = Router();
const prisma = new PrismaClient();

// 🔁 Ubah format tanggal jadi dd-mm-yyyy
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

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

    const formattedNotes = notes.map((note) => ({
      ...note,
      startDate: formatDate(note.startDate),
      endDate: formatDate(note.endDate),
      createdAt: formatDate(note.createdAt),
    }));

    res.json(formattedNotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
