import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Note {
  id: number;
  title: string;
  body: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  createdAt: string;
}

export default function NoteTable() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    async function fetchNotes() {
      const res = await fetch(`/api/notes?page=${page}&limit=5`);
      const data = await res.json();
      setNotes(data.data);
      setTotalPages(data.totalPages);
    }
    fetchNotes();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus catatan ini?')) return;

    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus catatan');
      alert('Catatan berhasil dihapus');
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus');
    }
  };

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Tabel Daftar Catatan</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 border-collapse">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-center">No</th>
              <th className="border px-4 py-2">Judul</th>
              <th className="border px-4 py-2">Deskripsi</th>
              <th className="border px-4 py-2 text-center">Tanggal Mulai</th>
              <th className="border px-4 py-2 text-center">Tanggal Selesai</th>
              <th className="border px-4 py-2 text-center">Gambar</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, i) => (
              <tr key={note.id} className="hover:bg-gray-50 text-center align-middle">
                <td className="border px-4 py-2">{(page - 1) * 5 + i + 1}</td>
                <td className="border px-4 py-2 text-left">{note.title}</td>
                <td className="border px-4 py-2 text-left max-w-xs">
                  <div className="truncate">
                    {note.body.length > 100 ? note.body.slice(0, 100) + '...' : note.body}
                  </div>
                </td>
                <td className="border px-4 py-2">{note.startDate?.slice(0, 10)}</td>
                <td className="border px-4 py-2">{note.endDate?.slice(0, 10)}</td>
                <td className="border px-4 py-2">
                  {note.imageUrl ? (
                    <img
                      src={note.imageUrl}
                      alt={note.title}
                      className="max-h-20 mx-auto rounded"
                    />
                  ) : (
                    '-'
                  )}
                </td>
                <td className="border px-4 py-2 space-x-1">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => router.push(`/notes/${note.id}`)}
                  >
                    🔍 View
                  </button>
                  <button
                    className="text-yellow-600 hover:underline"
                    onClick={() => router.push(`/notes/edit/${note.id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(note.id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4 max-w-full">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
