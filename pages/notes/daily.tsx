import { useState } from 'react';
import { useRouter } from 'next/router';

interface Note {
  id: number;
  title: string;
  body: string;
  startDate: string;
  imageUrl?: string;
}

export default function DailyNotes() {
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!date) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5002/notes/by-date?date=${date}`);
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      alert('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📅 Catatan Harian</h1>

      <div className="mb-6 flex items-center gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Cari Catatan
        </button>
      </div>

      {loading ? (
        <p>Memuat catatan...</p>
      ) : notes.length === 0 ? (
        <p>Tidak ada catatan pada tanggal tersebut.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white p-4 rounded shadow hover:shadow-md cursor-pointer transition"
              onClick={() => router.push(`/notes/view/${note.id}`)}
            >
              <h2 className="text-xl font-bold mb-1">{note.title}</h2>
              <p className="text-gray-600 mb-2">
                {note.body.length > 60 ? note.body.slice(0, 60) + '...' : note.body}
              </p>
              {note.imageUrl && (
                <img
                  src={note.imageUrl}
                  alt={note.title}
                  className="max-h-40 object-cover rounded"
                />
              )}
              <p className="text-sm text-gray-500 mt-2">{note.startDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
