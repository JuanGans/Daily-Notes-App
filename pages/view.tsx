import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Note {
  id: number;
  title: string;
  body: string;
  imageUrl?: string;
}

export default function ViewNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5002/notes?page=1&limit=1000') // ambil semua
      .then(res => res.json())
      .then(data => setNotes(data.data));
  }, []);

  return (
    <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map(note => (
        <div key={note.id} className="bg-white rounded shadow p-4 cursor-pointer hover:shadow-lg transition" onClick={() => router.push(`/notes/view/${note.id}`)}>
          <h2 className="text-lg font-bold">{note.title}</h2>
          <p className="text-sm text-gray-600 line-clamp-2">{note.body}</p>
          {note.imageUrl && <img src={note.imageUrl} alt={note.title} className="mt-2 rounded max-h-40 object-cover w-full" />}
        </div>
      ))}
    </div>
  );
}
