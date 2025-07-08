import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '../../../generated/client'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'

const router = Router()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret'

// ✅ Tipe request dengan user (hasil decode JWT)
interface RequestWithUser extends Request {
  user?: {
    id: number
    email: string
    role: string
  }
}

// ✅ Middleware autentikasi
const authenticateToken = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Access token required' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as RequestWithUser['user']
    req.user = decoded
    next()
  } catch {
    res.status(403).json({ message: 'Invalid token' })
  }
}

// ✅ Function untuk generate service token (admin token)
const generateServiceToken = () => {
  // Buat token dengan role admin untuk internal service communication
  const serviceUser = {
    id: 0, // Service user ID
    email: 'service@internal.com',
    role: 'ADMIN'
  }
  
  return jwt.sign(serviceUser, JWT_SECRET, { expiresIn: '5m' })
}

// ✅ GET /notes — Terbuka untuk semua user dengan service token untuk fetch user data
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 5
  const offset = (page - 1) * limit

  try {
    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          body: true,
          startDate: true,
          endDate: true,
          imageUrl: true,
          createdAt: true,
          userId: true,
        },
      }),
      prisma.note.count(),
    ])

    const uniqueUserIds = [...new Set(notes.map((note) => note.userId))]
    const userMap: Record<number, string> = {}

    // Generate service token untuk fetch user data
    const serviceToken = generateServiceToken()

    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          // Gunakan service token untuk mengakses user data
          const response = await fetch(`http://localhost:5001/users/${userId}`, {
            headers: { Authorization: `Bearer ${serviceToken}` }
          })

          if (response.ok) {
            const user = await response.json() as { id: number; name: string }
            userMap[userId] = user.name
          } else {
            console.error(`❌ Failed to fetch user ${userId}:`, response.status)
            userMap[userId] = 'Unknown'
          }
        } catch (error) {
          console.error(`❌ Error fetching user ${userId}:`, error)
          userMap[userId] = 'Unknown'
        }
      })
    )

    const notesWithUser = notes.map((note) => ({
      ...note,
      userName: userMap[note.userId] || 'Unknown',
    }))

    res.json({
      data: notesWithUser,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('❌ Error fetching notes:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// ✅ POST /notes — Buat note baru (harus autentikasi)
router.post('/', authenticateToken, async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { title, body, startDate, endDate, imageUrl } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    if (!title || !body || !startDate || !endDate) {
      res.status(400).json({ message: 'Semua field wajib diisi' })
      return
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        body,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        imageUrl,
        userId,
      },
    })

    res.status(201).json(newNote)
  } catch (err) {
    console.error('❌ Error creating note:', err)
    res.status(500).json({ message: 'Gagal membuat catatan' })
  }
})

// ✅ DELETE /notes/:id — Hanya pemilik atau admin yang boleh hapus
router.delete('/:id', authenticateToken, async (req: RequestWithUser, res: Response): Promise<void> => {
  const noteId = parseInt(req.params.id, 10)
  const userId = req.user?.id
  const isAdmin = req.user?.role === 'ADMIN'

  if (isNaN(noteId)) {
    res.status(400).json({ message: 'Invalid note ID' })
    return
  }

  try {
    const note = await prisma.note.findUnique({ where: { id: noteId } })

    if (!note) {
      res.status(404).json({ message: 'Note not found' })
      return
    }

    if (!isAdmin && note.userId !== userId) {
      res.status(403).json({ message: 'Tidak memiliki izin untuk menghapus catatan ini' })
      return
    }

    await prisma.note.delete({ where: { id: noteId } })
    res.json({ message: 'Catatan berhasil dihapus' })
  } catch (err) {
    console.error('❌ Error deleting note:', err)
    res.status(500).json({ message: 'Gagal menghapus catatan' })
  }
})

export default router