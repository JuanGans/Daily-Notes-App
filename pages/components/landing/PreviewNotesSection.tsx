'use client'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

interface Note {
  id: number
  title: string
  body: string
  imageUrl?: string
  createdAt: string
  userName: string
}

export default function PreviewNotesSection() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('http://localhost:5002/notes?limit=all')
        const data = await res.json()
        setNotes(data.data || [])
      } catch {
        setNotes([])
      }
    }
    fetchNotes()
  }, [])

  const duplicatedNotes = [...notes, ...notes] // untuk infinite scroll

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative bg-white shadow-2xl rounded-2xl border border-gray-200 p-6 overflow-hidden">
          <h2 className="text-2xl font-bold text-center mb-6">📝 Cuplikan Semua Catatan</h2>

          {/* Gradient kiri */}
          <div className="absolute top-0 left-0 w-16 h-full z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          {/* Gradient kanan */}
          <div className="absolute top-0 right-0 w-16 h-full z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

          <div className="scroll-track">
            <div className={`scroll-content ${isPaused ? 'paused' : ''}`}>
              {duplicatedNotes.map((note, index) => (
                <div
                  key={`${note.id}-${index}`}
                  className="bg-white min-w-[300px] max-w-[300px] h-[280px] rounded-xl shadow-md p-4 flex-shrink-0 mx-3 transform transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {note.imageUrl && (
                    <img
                      src={note.imageUrl}
                      alt={note.title}
                      className="h-32 w-full object-cover rounded-md mb-3"
                    />
                  )}
                  <div className="overflow-hidden">
                    <h3 className="text-base font-semibold mb-1 truncate">{note.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{note.body}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 truncate">
                    👤 {note.userName} | 📅 {format(new Date(note.createdAt), 'dd MMM yyyy')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scroll-track {
          overflow: hidden;
          width: 100%;
        }

        .scroll-content {
          display: flex;
          width: max-content;
          animation: scrollLoop 40s linear infinite;
        }

        .scroll-content.paused {
          animation-play-state: paused;
        }

        @keyframes scrollLoop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
