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
  userId: number;
  userName?: string; // ✅ Tambahkan authorName dari response
}

export default function NoteDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchNote() {
      try {
        const res = await fetch(`http://localhost:5002/notes/${id}`);
        if (!res.ok) throw new Error('Catatan tidak ditemukan');
        const data = await res.json();
        setNote(data);

        // ✅ Tidak perlu fetch user lagi karena authorName sudah ada dalam response
      } catch (err) {
        alert('Gagal memuat catatan');
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [id, router]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!note) return <p className="p-6 text-center">Catatan tidak ditemukan.</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-4xl font-bold mb-1">{note.title}</h1>
      <p className="text-gray-500 mb-4">
        <strong>Author:</strong> {note.userName || 'Unknown'}
      </p>
      <div className="text-gray-600 mb-6 whitespace-pre-wrap">{note.body}</div>
      <p><strong>Tanggal Mulai:</strong> {note.startDate?.slice(0, 10) || '-'}</p>
      <p><strong>Tanggal Selesai:</strong> {note.endDate?.slice(0, 10) || '-'}</p>
      {note.imageUrl && (
        <img
          src={note.imageUrl}
          alt={note.title}
          className="mt-6 max-w-full rounded shadow"
        />
      )}
    </main>
  );
}