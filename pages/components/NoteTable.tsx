import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Pencil, Trash2, X } from 'lucide-react';
import NoteForm from './NoteForm';
import ConfirmationModal from './ConfirmationModal';

interface Note {
  id: number;
  title: string;
  body: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  createdAt: string;
  userId: number;
  userName?: string;
}

interface DecodedToken {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

export default function NoteTable() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [userName, setUserName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const router = useRouter();

const fetchUserName = async (userId: number) => {
  try {
    const token = localStorage.getItem('token') || '';
    const res = await fetch(`http://localhost:5001/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error();
    const data = await res.json();
    setUserName(data.name); // atau sesuaikan dengan 'username'
  } catch {
    toast.error('Gagal memuat nama pengguna');
  }
};

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`http://localhost:5002/notes?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Gagal fetch catatan');

      const data = await res.json();

      if (user && user.role === 'ADMIN') {
        setNotes(data.data || []);
        setTotalPages(data.totalPages || 1);
      } else if (user) {
        const userNotes = (data.data || []).filter((note: Note) => note.userId === user.id);
        setNotes(userNotes);
        setTotalPages(Math.ceil(userNotes.length / 5));
      }
    } catch {
      toast.error('Gagal memuat data catatan');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUser(decoded);
      fetchUserName(decoded.id);
    } catch {
      toast.error('Token tidak valid, silakan login ulang');
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    if (user) fetchNotes();
  }, [page, user]);

  const confirmDelete = (note: Note) => {
    setNoteToDelete(note);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;
    const token = localStorage.getItem('token') || '';
    const toastId = toast.loading('Menghapus catatan...');

    try {
      const res = await fetch(`http://localhost:5002/notes/${noteToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Gagal menghapus catatan');

      toast.success('Catatan berhasil dihapus', { id: toastId });
      fetchNotes(); // Refresh data
    } catch {
      toast.error('Terjadi kesalahan saat menghapus', { id: toastId });
    } finally {
      setShowConfirm(false);
      setNoteToDelete(null);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Daftar Catatan "<span className="text-black-600">{userName || ''}"</span>
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 border-collapse">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2 text-center">No</th>
                <th className="border px-4 py-2 text-center">Author</th>
                <th className="border px-4 py-2">Judul</th>
                <th className="border px-4 py-2">Deskripsi</th>
                <th className="border px-4 py-2 text-center">Tanggal Mulai</th>
                <th className="border px-4 py-2 text-center">Tanggal Selesai</th>
                <th className="border px-4 py-2 text-center">Gambar</th>
                <th className="border px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note, i) => {
                const isOwner = user?.id === note.userId;
                const isAdmin = user?.role === 'ADMIN';
                const canEditOrDelete = isOwner || isAdmin;

                return (
                  <motion.tr
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="hover:bg-gray-50 text-center align-middle"
                  >
                    <td className="border px-4 py-2">{(page - 1) * 5 + i + 1}</td>
                    <td className="border px-4 py-2">{note.userName ?? 'Unknown'}</td>
                    <td className="border px-4 py-2 text-left">{note.title}</td>
                    <td className="border px-4 py-2 text-left max-w-xs truncate">
                      {note.body.length > 100 ? `${note.body.slice(0, 100)}...` : note.body}
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
                    <td className="border px-4 py-2">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          title="Lihat Detail"
                          onClick={() => router.push(`/notes/${note.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                        >
                          <Eye size={18} />
                        </button>
                        {canEditOrDelete && (
                          <>
                            <button
                              title="Edit Catatan"
                              onClick={() => {
                                setEditNote(note);
                                setShowForm(true);
                              }}
                              className="text-yellow-600 hover:text-yellow-800 transition-transform hover:scale-110"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              title="Hapus Catatan"
                              onClick={() => confirmDelete(note)}
                              className="text-red-600 hover:text-red-800 transition-transform hover:scale-110"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Halaman {page} dari {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="note-form-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative"
            >
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditNote(null);
                }}
                className="absolute top-3 right-4 text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>

              <NoteForm
                initialData={editNote || undefined}
                onSuccess={() => {
                  fetchNotes();
                  setShowForm(false);
                  setEditNote(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konfirmasi Hapus */}
      <ConfirmationModal
        isOpen={showConfirm}
        message={`Yakin ingin menghapus catatan "${noteToDelete?.title}"?`}
        onCancel={() => {
          setShowConfirm(false);
          setNoteToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </section>
  );
}
