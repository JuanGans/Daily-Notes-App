import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Note {
  id: number;
  title: string;
  body: string;
  imageUrl?: string;
  createdAt: string;
}

export default function Dashboard() {
  const [notesCount, setNotesCount] = useState(0);
  const [randomNotes, setRandomNotes] = useState<Note[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchNotesData() {
      const res = await fetch('/api/notes?page=1&limit=100');
      const data = await res.json();

      setNotesCount(data.total);

      // Ambil 3 catatan secara acak
      const shuffled = [...data.data].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      setRandomNotes(selected);

      // Ambil tanggal terbaru
      if (data.data.length > 0) {
        const latest = [...data.data].sort((a: Note, b: Note) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLastUpdated(new Date(latest[0].createdAt).toLocaleString());
      }
    }

    fetchNotesData();
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mb-8">
        {/* Total Catatan */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Total Catatan</h2>
          <p className="text-3xl text-blue-600">{notesCount}</p>
        </div>

        {/* To Do List */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Hal yang Perlu Dilakukan</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Tambah catatan baru 📌</li>
            <li>Edit atau hapus catatan lama ✏️</li>
            <li>Upload gambar pendukung 🖼️</li>
            <li>Jaga konsistensi menulis ✍️</li>
          </ul>
        </div>

        {/* 3 Catatan Acak */}
        <div className="bg-white rounded shadow p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">📖 FYP Catatan Harian</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {randomNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => router.push(`/notes/${note.id}`)}
                className="border rounded-lg p-3 bg-gray-50 hover:shadow cursor-pointer transition"
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
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Terakhir */}
        <div className="bg-white rounded shadow p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-2">📅 Aktivitas Terakhir</h2>
          <p className="text-gray-700">
            {lastUpdated
              ? `Catatan terakhir ditambahkan/diubah pada: ${lastUpdated}`
              : 'Belum ada catatan dibuat.'}
          </p>
        </div>
      </div>
    </section>
  );
}
