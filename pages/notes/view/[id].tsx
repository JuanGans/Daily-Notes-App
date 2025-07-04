import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Note {
  id: number;
  title: string;
  body: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  createdAt: string;
}

export default function NoteDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5002/notes/${id}`)
      .then(res => res.json())
      .then(data => setNote(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!note) return <p className="p-6 text-red-600">Note not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
      <p className="text-gray-600 mb-2">{note.body}</p>
      <p className="text-sm text-gray-500 mb-2">🕒 {note.startDate?.slice(0, 10)} - {note.endDate?.slice(0, 10)}</p>
      {note.imageUrl && <img src={note.imageUrl} className="rounded-lg mt-4 max-h-60 object-contain" />}
      <button onClick={() => router.back()} className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">⬅️ Kembali</button>
    </div>
  );
}
