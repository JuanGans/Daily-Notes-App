import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../../../generated/client';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

interface RequestWithUser extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// Middleware autentikasi
const authenticateToken = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as RequestWithUser['user'];
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// ✅ Utility konversi tanggal dd-mm-yyyy → Date object
const parseDateString = (value: string): Date => {
  const [dd, mm, yyyy] = value.split('-').map(Number);
  return new Date(yyyy, mm - 1, dd);
};

// 🔁 Utility untuk ubah format Date → dd-mm-yyyy
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-';
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// ✅ GET /notes
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const rawLimit = req.query.limit as string;
  const limit = rawLimit === 'all' ? undefined : parseInt(rawLimit) || 5;
  const offset = limit ? (page - 1) * limit : undefined;

  try {
    // Ambil data note dan total count
    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          body: true,
          imageUrl: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          userId: true, // ✅ Diperlukan agar bisa ambil nama user
        },
      }),
      prisma.note.count(),
    ]);

    const uniqueUserIds = [...new Set(notes.map(note => note.userId))];
    const userMap: Record<number, string> = {};
    const commentCountMap: Record<number, number> = {};

    const serviceToken = jwt.sign(
      { id: 0, email: 'service@internal.com', role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '5m' }
    );

    // 🔁 Ambil nama user dari user-service
    await Promise.all(uniqueUserIds.map(async (userId) => {
      try {
        const response = await fetch(`http://localhost:5001/users/${userId}`, {
          headers: { Authorization: `Bearer ${serviceToken}` },
        });
        if (response.ok) {
          const user = await response.json() as { id: number; name: string };
          userMap[userId] = user.name;
        } else {
          userMap[userId] = 'Unknown';
        }
      } catch (err) {
        console.error(`❌ Gagal fetch user ${userId}:`, err);
        userMap[userId] = 'Unknown';
      }
    }));

    // 🔁 Hitung komentar dari comment-service
    await Promise.all(notes.map(async (note) => {
      try {
        const response = await fetch(`http://localhost:5003/comments/count/${note.id}`);
        const data = await response.json() as { total: number };
        commentCountMap[note.id] = data.total || 0;
      } catch (err) {
        console.error(`❌ Gagal fetch komentar note ${note.id}:`, err);
        commentCountMap[note.id] = 0;
      }
    }));

    // 🔁 Format tanggal ke dd-mm-yyyy
    const formatDate = (date: Date | string | null | undefined): string => {
      if (!date) return '-';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '-'; // prevent invalid date
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // 🚀 Gabungkan semuanya
    const result = notes.map(note => ({
      id: note.id,
      title: note.title,
      body: note.body,
      imageUrl: note.imageUrl,
      userId: note.userId,
      userName: userMap[note.userId] || 'Unknown',
      totalComments: commentCountMap[note.id] || 0,
      startDate: formatDate(note.startDate),
      endDate: formatDate(note.endDate),
      createdAt: formatDate(note.createdAt),
    }));

    res.json({
      data: result,
      total,
      page,
      totalPages: limit ? Math.ceil(total / limit) : 1,
    });

  } catch (err) {
    console.error('❌ Error fetching notes:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// ✅ POST /notes
router.post('/', authenticateToken, async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { title, body, startDate, endDate, imageUrl } = req.body;
    const userId = req.user?.id;

    if (!userId || !title || !body || !startDate || !endDate) {
      res.status(400).json({ message: 'Field tidak lengkap' });
      return;
    }

    const note = await prisma.note.create({
      data: {
        title,
        body,
        startDate: parseDateString(startDate),
        endDate: parseDateString(endDate),
        imageUrl,
        userId,
      },
    });

    res.status(201).json(note);
  } catch (err) {
    console.error('❌ Error creating note:', err);
    res.status(500).json({ message: 'Gagal membuat catatan' });
  }
});

export default router;
