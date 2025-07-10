import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '../../../generated/client'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'

const router = Router()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret'

interface RequestWithUser extends Request {
  user?: {
    id: number
    email: string
    role: string
  }
}

// Middleware autentikasi
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

// Generate service token (digunakan untuk inter-service fetch)
const generateServiceToken = () => {
  const serviceUser = {
    id: 0,
    email: 'service@internal.com',
    role: 'ADMIN'
  }

  return jwt.sign(serviceUser, JWT_SECRET, { expiresIn: '5m' })
}

// ✅ GET /notes — Daftar catatan lengkap dengan user name dan jumlah komentar
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1
  const rawLimit = req.query.limit as string
  const limit = rawLimit === 'all' ? undefined : parseInt(rawLimit) || 5
  const offset = limit ? (page - 1) * limit : undefined

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
    const commentCountMap: Record<number, number> = {}

    const serviceToken = generateServiceToken()

    // Ambil nama user dari user-service
    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          const res = await fetch(`http://localhost:5001/users/${userId}`, {
            headers: { Authorization: `Bearer ${serviceToken}` }
          })
          if (res.ok) {
            const user = await res.json() as { id: number; name: string }
            userMap[userId] = user.name
          } else {
            userMap[userId] = 'Unknown'
          }
        } catch (err) {
          console.error(`❌ Gagal ambil user ${userId}:`, err)
          userMap[userId] = 'Unknown'
        }
      })
    )

    // Hitung komentar dari comment-service
    await Promise.all(
      notes.map(async (note) => {
        try {
          const res = await fetch(`http://localhost:5003/comments/count/${note.id}`)
          const data = await res.json() as { total: number }
          commentCountMap[note.id] = data.total || 0
        } catch (err) {
          console.error(`❌ Gagal hitung komentar note ${note.id}:`, err)
          commentCountMap[note.id] = 0
        }
      })
    )

    const notesWithUser = notes.map((note) => ({
      ...note,
      userName: userMap[note.userId] || 'Unknown',
      totalComments: commentCountMap[note.id] || 0,
    }))

    res.json({
      data: notesWithUser,
      total,
      page,
      totalPages: limit ? Math.ceil(total / limit) : 1,
    })
  } catch (err) {
    console.error('❌ Error fetching notes:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// ✅ POST /notes — Tambah note
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

// ✅ DELETE /notes/:id — Hapus note
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
