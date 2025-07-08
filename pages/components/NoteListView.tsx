import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Note {
  id: number;
  title: string;
  body: string;
  imageUrl?: string;
  userName?: string;
}

export default function NoteListView() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchNotes() {
      const res = await fetch('http://localhost:5002/notes?page=1&limit=100');
      const data = await res.json();
      setNotes(data.data);
    }
    fetchNotes();
  }, []);

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Semua Catatan Harian</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.length === 0 && <p className="text-gray-600">Belum ada catatan yang dibuat.</p>}

        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => router.push(`/notes/${note.id}`)}
            className="cursor-pointer border rounded-lg p-4 shadow-sm hover:shadow-md transition hover:scale-[1.01] bg-white flex gap-4"
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
          </div>
        ))}
      </div>
    </section>
  );
}
