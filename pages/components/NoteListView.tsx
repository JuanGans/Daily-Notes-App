import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface Note {
  id: number;
  title: string;
  body: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  userName?: string;
}

export default function NoteListView() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});
  const router = useRouter();

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch('http://localhost:5002/notes?limit=all');
        const json = await res.json();
        const result = Array.isArray(json?.data) ? json.data : [];
        setNotes(result);
      } catch (err) {
        console.error('❌ Gagal mengambil catatan:', err);
      }
    }

    fetchNotes();
  }, []);

  useEffect(() => {
    async function fetchCommentCounts() {
      const counts: Record<number, number> = {};

      await Promise.all(
        notes.map(async (note) => {
          try {
            const res = await fetch(`http://localhost:5003/comments/note/${note.id}`);
            const data = await res.json();
            counts[note.id] = data.length;
          } catch {
            counts[note.id] = 0;
          }
        })
      );

      setCommentCounts(counts);
    }

    if (notes.length) fetchCommentCounts();
  }, [notes]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {notes.map((note, index) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          onClick={() => router.push(`/notes/${note.id}`)}
          className="relative cursor-pointer border rounded-lg p-4 shadow-sm hover:shadow-md transition hover:scale-[1.01] bg-white flex gap-4"
        >
          {note.imageUrl ? (
            <img
              src={note.imageUrl}
              alt={note.title}
              className="w-24 h-24 object-cover rounded-md"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <h2 className="font-semibold text-lg text-blue-700 mb-1 truncate">{note.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-2">{note.body}</p>
            <p className="text-gray-500 text-xs mt-2 italic">
              By: {note.userName || 'Unknown'}
            </p>
          </div>

          <div className="absolute bottom-2 right-3 flex items-center text-gray-500 text-xs gap-1">
            <MessageSquare className="w-4 h-4" />
            {commentCounts[note.id] ?? 0}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
