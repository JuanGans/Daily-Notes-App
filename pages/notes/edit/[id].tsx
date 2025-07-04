import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NoteForm from '../../components/NoteForm'; 
interface Note {
  id: number;
  title: string;
  body: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
}

export default function EditNotePage() {
  const router = useRouter();
  const { id } = router.query;

  const [noteData, setNoteData] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    async function fetchNote() {
      try {
        const res = await fetch(`/api/notes/${id}`);
        if (!res.ok) throw new Error('Gagal memuat catatan');

        const data = await res.json();
        setNoteData({
          id: data.id,
          title: data.title,
          body: data.body,
          startDate: data.startDate?.slice(0, 10) || '',
          endDate: data.endDate?.slice(0, 10) || '',
          imageUrl: data.imageUrl || '',
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Memuat data catatan...</p>;
  if (error) return <p className="p-6 text-red-600 text-center">{error}</p>;
  if (!noteData) return <p className="p-6 text-center">Catatan tidak ditemukan</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <NoteForm
        initialData={noteData}
        onSuccess={() => router.push('/')}
      />
    </div>
  );
}
