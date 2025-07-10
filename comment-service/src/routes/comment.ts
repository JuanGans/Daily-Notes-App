import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

interface JwtUser {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// Middleware verifikasi JWT
function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token diperlukan' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUser;
    (req as any).user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Token tidak valid' });
  }
}

// ✅ Tambah komentar
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { content, noteId } = req.body;
  const user = (req as any).user as JwtUser;

  if (!content || !noteId) {
    res.status(400).json({ message: 'Content dan Note ID wajib diisi' });
    return;
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        noteId,
        userId: user.id,
        userName: user.name,
      },
    });
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Gagal menambahkan komentar:', err);
    res.status(500).json({ message: 'Gagal menambahkan komentar' });
  }
});

// ✅ Ambil komentar per Note ID
router.get('/note/:noteId', async (req: Request, res: Response): Promise<void> => {
  const noteId = parseInt(req.params.noteId);
  if (isNaN(noteId)) {
    res.status(400).json({ message: 'Note ID tidak valid' });
    return;
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { noteId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(comments);
  } catch (err) {
    console.error('Gagal mengambil komentar:', err);
    res.status(500).json({ message: 'Gagal mengambil komentar' });
  }
});

// ✅ Hitung jumlah komentar per Note ID (untuk frontend atau note-service)
router.get('/count/:noteId', async (req: Request, res: Response): Promise<void> => {
  const noteId = parseInt(req.params.noteId);
  if (isNaN(noteId)) {
    res.status(400).json({ message: 'Note ID tidak valid' });
    return;
  }

  try {
    const total = await prisma.comment.count({
      where: { noteId },
    });
    res.json({ total });
  } catch (err) {
    console.error('Gagal menghitung komentar:', err);
    res.status(500).json({ message: 'Gagal menghitung komentar' });
  }
});

// ✅ Hapus komentar (khusus ADMIN)
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const commentId = parseInt(req.params.id);
  const user = (req as any).user as JwtUser;

  if (isNaN(commentId)) {
    res.status(400).json({ message: 'ID komentar tidak valid' });
    return;
  }

  if (user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Hanya admin yang dapat menghapus komentar' });
    return;
  }

  try {
    await prisma.comment.delete({ where: { id: commentId } });
    res.json({ message: 'Komentar berhasil dihapus' });
  } catch (err) {
    console.error('Gagal menghapus komentar:', err);
    res.status(500).json({ message: 'Gagal menghapus komentar' });
  }
});

export default router;
