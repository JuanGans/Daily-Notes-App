import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../../generated/client';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// ✅ Function untuk generate service token
const generateServiceToken = () => {
  const serviceUser = {
    id: 0,
    email: 'service@internal.com',
    role: 'ADMIN'
  };
  
  return jwt.sign(serviceUser, JWT_SECRET, { expiresIn: '5m' });
};

// ✅ Function untuk fetch user by ID
const fetchUserById = async (userId: number): Promise<string> => {
  try {
    const serviceToken = generateServiceToken();
    const response = await fetch(`http://localhost:5001/users/${userId}`, {
      headers: { Authorization: `Bearer ${serviceToken}` }
    });

    if (response.ok) {
      const user = await response.json() as { id: number; name: string };
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

// GET /notes/:id - Dengan author name
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid note ID' });
      return;
    }

    const note = await prisma.note.findUnique({ where: { id } });
    
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    // Fetch author name
    const userName = await fetchUserById(note.userId);

    // Return note with author name
    res.json({
      ...note,
      userName
    });
  } catch (error) {
    console.error('❌ Error fetching note:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /notes/:id
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { title, body, startDate, endDate, imageUrl } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid note ID' });
      return;
    }

    const updated = await prisma.note.update({
      where: { id },
      data: { 
        title, 
        body, 
        startDate: new Date(startDate), 
        endDate: new Date(endDate), 
        imageUrl 
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('❌ Error updating note:', error);
    res.status(500).json({ message: 'Failed to update note' });
  }
});

// DELETE /notes/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid note ID' });
      return;
    }

    await prisma.note.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    console.error('❌ Error deleting note:', error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
});

export default router;