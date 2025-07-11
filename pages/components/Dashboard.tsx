import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';

interface Note {
  id: number;
  title: string;
  body: string;
  imageUrl?: string;
  createdAt: string;
  userName?: string;
  userId: number;
}

interface DecodedToken {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

export default function Dashboard() {
  const [notesCount, setNotesCount] = useState(0);
  const [myNotesCount, setMyNotesCount] = useState(0);
  const [randomNotes, setRandomNotes] = useState<Note[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});
  const [user, setUser] = useState<DecodedToken | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUser(decoded);
    } catch {
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    async function fetchNotesData() {
      const res = await fetch('http://localhost:5002/notes?page=1&limit=100');
      const data = await res.json();

      setNotesCount(data.total);

      if (user) {
        const myNotes = data.data.filter((note: Note) => note.userId === user.id);
        setMyNotesCount(myNotes.length);

        const shuffled = [...data.data].sort(() => 0.5 - Math.random());
        setRandomNotes(shuffled.slice(0, 3));
      }
    }

    if (user) fetchNotesData();
  }, [user]);

  useEffect(() => {
    async function fetchCommentCounts() {
      const counts: Record<number, number> = {};

      await Promise.all(
        randomNotes.map(async (note) => {
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

    if (randomNotes.length > 0) fetchCommentCounts();
  }, [randomNotes]);

  return (
    <section className="flex justify-center px-4 py-6">
      <div className="w-full max-w-screen-lg space-y-4">
        {/* Hal yang Perlu Dilakukan */}
        <motion.div
          className="bg-white rounded shadow p-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-1">Hal yang Perlu Dilakukan</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Tambah catatan baru 📌</li>
            <li>Edit atau hapus catatan lama ✏️</li>
            <li>Upload gambar pendukung 🖼️</li>
            <li>Jaga konsistensi menulis ✍️</li>
          </ul>
        </motion.div>

        {/* Catatan Saya & Total Semua Catatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            className="bg-white rounded shadow p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-base font-medium mb-1 text-blue-700">Catatan Saya</h2>
            <p className="text-3xl font-bold text-blue-600">{myNotesCount}</p>
            <p className="text-sm text-gray-600 mt-1">Total catatan yang kamu buat.</p>
          </motion.div>

          <motion.div
            className="bg-white rounded shadow p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-base font-medium mb-1">Total Semua Catatan</h2>
            <p className="text-3xl font-bold text-gray-700">{notesCount}</p>
            <p className="text-sm text-gray-500 mt-1">Termasuk catatan semua pengguna.</p>
          </motion.div>
        </div>

        {/* FYP Catatan */}
<motion.div
  className="bg-white rounded shadow p-6 col-span-2"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.3 }}
>
  <h2 className="text-xl font-semibold mb-4">📖 FYP Catatan Harian</h2>
  <div className="grid md:grid-cols-3 gap-4">
    {randomNotes.map((note, index) => (
      <motion.div
        key={note.id}
        onClick={() => router.push(`/notes/${note.id}`)}
        className="relative border rounded-lg p-3 bg-gray-50 hover:shadow cursor-pointer transition"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        {note.imageUrl ? (
          <img
            src={note.imageUrl}
            alt={note.title}
            className="w-full h-32 object-cover rounded mb-2"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded mb-2">
            No Image
          </div>
        )}

        <h3 className="font-bold text-blue-700 mb-1 truncate">{note.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {note.body.length > 100 ? note.body.slice(0, 100) + '...' : note.body}
        </p>
        <p className="text-gray-500 text-xs mt-2 italic">
          By: {note.userName || 'Unknown'}
        </p>

        <div className="absolute bottom-2 right-3 flex items-center text-gray-500 text-xs gap-1">
          <MessageSquare className="w-4 h-4" />
          {commentCounts[note.id] ?? 0}
        </div>
      </motion.div>
    ))}
  </div>
</motion.div>

      </div>
    </section>
  );
}
