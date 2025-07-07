import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { jwtDecode } from 'jwt-decode'

interface NoteFormProps {
  onSuccess?: () => void
  initialData?: {
    id?: number
    title?: string
    body?: string
    startDate?: string
    endDate?: string
    imageUrl?: string
  }
}

interface DecodedToken {
  id: number
  email: string
  role: 'USER' | 'ADMIN'
}

export default function NoteForm({ onSuccess, initialData }: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [body, setBody] = useState(initialData?.body || '')
  const [startDate, setStartDate] = useState(initialData?.startDate || '')
  const [endDate, setEndDate] = useState(initialData?.endDate || '')
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')
  const [uploading, setUploading] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const router = useRouter()

  // Ambil userId dari token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const decoded = jwtDecode<DecodedToken>(token)
      setUserId(decoded.id)
    } catch (err) {
      console.error('Token tidak valid')
    }
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('http://localhost:5002/notes/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload gagal')

      const data = await res.json()
      setImageUrl(data.url)
    } catch (error) {
      alert('Gagal upload gambar')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !body || !startDate || !endDate) {
      alert('Semua field wajib diisi')
      return
    }

    if (!userId) {
      alert('Gagal mengambil userId dari token')
      return
    }

    const payload = {
      title,
      body,
      startDate,
      endDate,
      imageUrl,
      userId, // ✅ Kirim userId
    }

    try {
      const token = localStorage.getItem('token') || ''
      let res

      if (initialData?.id) {
        // Edit
        res = await fetch(`http://localhost:5002/notes/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
      } else {
        // Tambah
        res = await fetch('http://localhost:5002/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) {
        const err = await res.json()
        alert('Gagal menyimpan catatan: ' + (err.message || 'Unknown Error'))
        return
      }

      alert(`Catatan berhasil ${initialData?.id ? 'diupdate' : 'ditambahkan'}!`)

      // Reset
      setTitle('')
      setBody('')
      setStartDate('')
      setEndDate('')
      setImageUrl('')
      if (onSuccess) onSuccess()
      else router.push('/') // opsional redirect
    } catch (error) {
      alert('Terjadi kesalahan saat mengirim data')
      console.error(error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {initialData?.id ? 'Edit Catatan' : 'Tambah Catatan'}
      </h2>

      <div>
        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
          Judul
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder="Masukkan judul catatan"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-gray-700 font-semibold mb-2">
          Deskripsi
        </label>
        <textarea
          id="body"
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          rows={4}
          placeholder="Tuliskan deskripsi catatan..."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-gray-700 font-semibold mb-2">
            Tanggal Mulai
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-gray-700 font-semibold mb-2">
            Tanggal Selesai
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Upload Gambar</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-600
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-100 file:text-blue-700
                     hover:file:bg-blue-200
                     cursor-pointer"
        />
        {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="mt-4 max-h-48 rounded-lg border shadow-sm object-contain"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition"
      >
        {initialData?.id ? 'Update Catatan' : 'Tambah Catatan'}
      </button>
    </form>
  )
}
