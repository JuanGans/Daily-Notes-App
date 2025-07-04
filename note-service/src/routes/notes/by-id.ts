import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../../generated/client';

const router = Router();
const prisma = new PrismaClient();

// GET /notes/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const note = await prisma.note.findUnique({ where: { id } });
  res.json(note);
});

// PUT /notes/:id
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, body, startDate, endDate, imageUrl } = req.body;

  const updated = await prisma.note.update({
    where: { id },
    data: { title, body, startDate: new Date(startDate), endDate: new Date(endDate), imageUrl },
  });

  res.json(updated);
});

// DELETE /notes/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.note.delete({ where: { id } });
  res.status(204).end();
});

export default router;
