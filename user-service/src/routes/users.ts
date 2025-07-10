  import { Router, Request, Response, NextFunction } from 'express'
  import { PrismaClient } from '../../generated/client'
  import bcrypt from 'bcryptjs'
  import jwt from 'jsonwebtoken'

  const router = Router()
  const prisma = new PrismaClient()
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123'

  // ✅ Middleware autentikasi token
  const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      res.status(401).json({ message: 'Access token required' })
      return
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: number
        email: string
        role: string
      }
      ;(req as any).user = decoded
      next()
    } catch {
      res.status(403).json({ message: 'Invalid or expired token' })
    }
  }

  // ✅ Register user (untuk umum)
  router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    try {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        res.status(409).json({ message: 'Email already registered' })
        return
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'USER',
        },
      })

      res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      })
    } catch (err) {
      console.error('❌ Error registering user:', err)
      res.status(500).json({ message: 'Internal server error' })
    }
  })

  /* ✅ TAMBAHKAN: Admin menambahkan user baru */
  router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUser = (req as any).user
    const { name, email, password, role } = req.body

    if (currentUser?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Only admin can add users' })
      return
    }

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: 'Name, email, password, and role are required' })
      return
    }

    try {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        res.status(409).json({ message: 'Email already registered' })
        return
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })

      res.status(201).json(newUser)
    } catch (err) {
      console.error('❌ Error adding user by admin:', err)
      res.status(500).json({ message: 'Internal server error' })
    }
  })

  // ✅ Get all users
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
      })
      res.json(users)
    } catch (err) {
      console.error('❌ Error fetching users:', err)
      res.status(500).json({ message: 'Internal server error' })
    }
  })

  // ✅ Get user by ID (for note-service to get author)
  router.get('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id, 10)

    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' })
      return
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
        },
      })

      if (!user) {
        res.status(404).json({ message: 'User not found' })
        return
      }

      res.json(user)
    } catch (err) {
      console.error('❌ Error fetching user:', err)
      res.status(500).json({ message: 'Internal server error' })
    }
  })

  // ✅ Update user
  router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id, 10)
    const { name, email, role } = req.body

    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' })
      return
    }

    try {
      const existing = await prisma.user.findUnique({ where: { id: userId } })
      if (!existing) {
        res.status(404).json({ message: 'User not found' })
        return
      }

      if (email && email !== existing.email) {
        const emailExists = await prisma.user.findUnique({ where: { email } })
        if (emailExists) {
          res.status(409).json({ message: 'Email already registered' })
          return
        }
      }

      const updated = await prisma.user.update({
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
      })

      res.json(updated)
    } catch (err) {
      console.error('❌ Error updating user:', err)
      res.status(500).json({ message: 'Internal server error' })
    }
  })

  // ✅ Delete user
  router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id, 10)

    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' })
      return
    }

    try {
      const existing = await prisma.user.findUnique({ where: { id: userId } })
      if (!existing) {
        res.status(404).json({ message: 'User not found' })
        return
      }

      await prisma.user.delete({ where: { id: userId } })
      res.json({ message: 'User deleted successfully' })
    } catch (err) {
      console.error('❌ Error deleting user:', err)
      res.status(500).json({ message: 'Internal server error' })
    }
  })

// ✅ Login user
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email dan password wajib diisi' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ message: 'Email tidak ditemukan' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Password salah' });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // ✅ Hanya satu response
    res.status(200).json({ token });

  } catch (error) {
    console.error('❌ Error saat login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan di server' });
  }
});

  export default router
