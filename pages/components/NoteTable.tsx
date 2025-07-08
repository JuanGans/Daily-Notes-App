import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { jwtDecode } from 'jwt-decode'

interface Note {
  id: number
  title: string
  body: string
  startDate?: string
  endDate?: string
  imageUrl?: string
  createdAt: string
  userId: number
  userName?: string
}

interface DecodedToken {
  id: number
  email: string
  role: 'USER' | 'ADMIN'
}

export default function NoteTable() {
  const [notes, setNotes] = useState<Note[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [user, setUser] = useState<DecodedToken | null>(null)
  const router = useRouter()

  // Ambil data user dari token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    try {
      const decoded: DecodedToken = jwtDecode(token)
      setUser(decoded)
    } catch (err) {
      console.error('Invalid token')
      localStorage.removeItem('token')
      router.push('/auth/login')
    }
  }, [router])

  // Ambil daftar catatan
  useEffect(() => {
    async function fetchNotes() {
      try {
        const token = localStorage.getItem('token') || ''
        const res = await fetch(`http://localhost:5002/notes?page=${page}&limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          throw new Error('Gagal fetch catatan')
        }

        const data = await res.json()
        setNotes(data.data || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        console.error('Failed to fetch notes:', err)
      }
    }

    if (user) fetchNotes()
  }, [page, user])

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus catatan ini?')) return

    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`http://localhost:5002/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Gagal menghapus catatan')
      alert('Catatan berhasil dihapus')
      setNotes(notes.filter((note) => note.id !== id))
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus')
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Tabel Daftar Catatan</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 border-collapse">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-center">No</th>
              <th className="border px-4 py-2 text-center">Author</th>
              <th className="border px-4 py-2">Judul</th>
              <th className="border px-4 py-2">Deskripsi</th>
              <th className="border px-4 py-2 text-center">Tanggal Mulai</th>
              <th className="border px-4 py-2 text-center">Tanggal Selesai</th>
              <th className="border px-4 py-2 text-center">Gambar</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, i) => {
              const isOwner = user?.id === note.userId
              const isAdmin = user?.role === 'ADMIN'
              const canEditOrDelete = isOwner || isAdmin

              return (
                <tr key={note.id} className="hover:bg-gray-50 text-center align-middle">
                  <td className="border px-4 py-2">{(page - 1) * 5 + i + 1}</td>
                  <td className="border px-4 py-2">{note.userName ?? 'Unknown'}</td>
                  <td className="border px-4 py-2 text-left">{note.title}</td>
                  <td className="border px-4 py-2 text-left max-w-xs truncate">
                    {note.body.length > 100 ? `${note.body.slice(0, 100)}...` : note.body}
                  </td>
                  <td className="border px-4 py-2">{note.startDate?.slice(0, 10)}</td>
                  <td className="border px-4 py-2">{note.endDate?.slice(0, 10)}</td>
                  <td className="border px-4 py-2">
                    {note.imageUrl ? (
                      <img
                        src={note.imageUrl}
                        alt={note.title}
                        className="max-h-20 mx-auto rounded"
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="border px-4 py-2 space-x-1">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => router.push(`/notes/${note.id}`)}
                    >
                      🔍 View
                    </button>
                    {canEditOrDelete && (
                      <>
                        <button
                          className="text-yellow-600 hover:underline"
                          onClick={() => router.push(`/notes/edit/${note.id}`)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(note.id)}
                        >
                          🗑 Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
