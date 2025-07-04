import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { date } = req.query;
  if (!date || typeof date !== 'string') {
    return res.status(400).json({ message: 'Tanggal tidak valid' });
  }

  try {
    const notes = await prisma.note.findMany({
      where: {
        startDate: {
          equals: new Date(date),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
}
