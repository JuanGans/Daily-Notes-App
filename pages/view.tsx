import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Note {
  id: number;
  title: string;
  body: string;
  imageUrl?: string;
  userName?: string; // Tambahkan field authorName
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {notes.map(note => (
        <div 
          key={note.id}
          className="cursor-pointer border rounded-lg p-4 shadow-sm hover:shadow-md transition hover:scale-[1.01] bg-white flex gap-4"
          onClick={() => router.push(`/notes/view/${note.id}`)}
        >
          {note.imageUrl && (
            <img 
              alt={note.title} 
              className="w-24 h-24 object-cover rounded-md" 
              src={note.imageUrl}
            />
          )}
          <div className="flex-1 overflow-hidden">
  <h2 className="font-semibold text-lg text-blue-700 mb-1 truncate">
    {note.title}
  </h2>
  <p className="text-gray-600 text-sm line-clamp-2">
    {note.body}
  </p>
  <p className="text-gray-600 text-sm line-clamp-2">
    {note.userName || 'Unknown'}
  </p>
</div>
        </div>
      ))}
    </div>
  );
}