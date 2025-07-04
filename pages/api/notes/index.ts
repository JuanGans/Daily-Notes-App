// /pages/api/notes/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '5', 10);

      try {
        const notes = await prisma.note.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'asc' },
        });

        const total = await prisma.note.count();

        return res.status(200).json({
          data: notes,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        });
      } catch (error) {
        console.error('❌ Error fetching notes:', error);
        return res.status(500).json({ message: 'Failed to fetch notes' });
      }
    }

    case 'POST': {
      const { title, body, startDate, endDate, imageUrl } = req.body;

      console.log('📥 Received POST:', { title, body, startDate, endDate, imageUrl });

      if (!title || !body || !startDate || !endDate) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
      }

      try {
        const note = await prisma.note.create({
          data: {
            title,
            body,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            imageUrl: imageUrl || null,
          },
        });

        console.log('✅ Note created:', note);
        return res.status(201).json(note);
      } catch (error) {
        console.error('❌ Error creating note:', error);
        return res.status(500).json({ message: 'Gagal membuat catatan' });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
