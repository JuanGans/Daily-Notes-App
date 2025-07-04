import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const noteId = Number(id);

  if (isNaN(noteId)) {
    return res.status(400).json({ error: 'Invalid note ID' });
  }

  if (req.method === 'GET') {
    try {
      const note = await prisma.note.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      return res.status(200).json(note);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch note' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.note.delete({ where: { id: noteId } });
      return res.status(200).json({ message: 'Note deleted' });
    } catch (error) {
      return res.status(404).json({ error: 'Note not found' });
    }
  }

  if (req.method === 'PUT') {
    const { title, body, startDate, endDate, imageUrl } = req.body;

    if (!title || !body || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const oldNote = await prisma.note.findUnique({
        where: { id: noteId },
      });

      if (!oldNote) return res.status(404).json({ error: 'Note not found' });

      const updated = await prisma.note.update({
        where: { id: noteId },
        data: {
          title,
          body,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          imageUrl: imageUrl ?? oldNote.imageUrl,
        },
      });

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update note' });
    }
  }

  res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
