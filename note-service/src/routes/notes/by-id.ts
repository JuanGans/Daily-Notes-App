import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../../generated/client';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// 🔁 Format tanggal dd-mm-yyyy
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-'; // Tangani tanggal invalid
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// ✅ Generate token internal
const generateServiceToken = () => {
  const serviceUser = {
    id: 0,
    email: 'service@internal.com',
    role: 'ADMIN',
  };
  return jwt.sign(serviceUser, JWT_SECRET, { expiresIn: '5m' });
};

// ✅ Ambil nama user dari user-service
const fetchUserById = async (userId: number): Promise<string> => {
  try {
    const serviceToken = generateServiceToken();
    const response = await fetch(`http://localhost:5001/users/${userId}`, {
      headers: { Authorization: `Bearer ${serviceToken}` },
    });

    if (response.ok) {
      const user = (await response.json()) as { id: number; name: string };
      return user.name;
    } else {
      console.error(`❌ Failed to fetch user ${userId}:`, response.status);
      return 'Unknown';
    }
  } catch (error) {
    console.error(`❌ Error fetching user ${userId}:`, error);
    return 'Unknown';
  }
};

// ✅ GET /notes/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid note ID' });

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const userName = await fetchUserById(note.userId);

    return res.json({
      ...note,
      startDate: formatDate(note.startDate),
      endDate: formatDate(note.endDate),
      createdAt: formatDate(note.createdAt),
      userName,
    });
  } catch (error) {
    console.error('❌ Error fetching note:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ PUT /notes/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, body, startDate, endDate, imageUrl } = req.body;

    console.log('Received:', { startDate, endDate });

    if (isNaN(id)) return res.status(400).json({ message: 'Invalid note ID' });

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const updated = await prisma.note.update({
      where: { id },
      data: {
        title,
        body,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        imageUrl,
      },
    });

    return res.json({
      ...updated,
      startDate: formatDate(updated.startDate),
      endDate: formatDate(updated.endDate),
      createdAt: formatDate(updated.createdAt),
    });
  } catch (error) {
    console.error('❌ Error updating note:', error);
    return res.status(500).json({ message: 'Failed to update note' });
  }
});

// ✅ DELETE /notes/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid note ID' });

    await prisma.note.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    console.error('❌ Error deleting note:', error);
    return res.status(500).json({ message: 'Failed to delete note' });
  }
});

export default router;
