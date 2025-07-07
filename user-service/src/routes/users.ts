// src/routes/users.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../generated/client'; // Sesuaikan path jika beda
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

// ✅ REGISTER USER
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
      },
    });
    
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error('❌ Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ GET ALL USERS
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ GET USER BY ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = parseInt(id, 10);
  
  if (isNaN(userId)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ UPDATE USER
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  const userId = parseInt(id, 10);
  
  if (isNaN(userId)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        res.status(409).json({ message: 'Email already registered' });
        return;
      }
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ DELETE USER
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = parseInt(id, 10);
  
  if (isNaN(userId)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;