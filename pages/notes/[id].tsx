import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import CommentForm from '../components/comments/CommentForm';
import CommentList from '../components/comments/CommentList';
import { getToken } from '@/utils/auth';
import { parseJwt } from '@/utils/parseJwt';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../components/ConfirmationModal';

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

export default function NoteDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const token = getToken();
  const user = token ? parseJwt(token) : null;
  const userRole = user?.role || 'USER';

  const [refreshComments, setRefreshComments] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchNote() {
      try {
        const res = await fetch(`http://localhost:5002/notes/${id}`);
        if (!res.ok) throw new Error('Catatan tidak ditemukan');
        const data = await res.json();
        setNote(data);
      } catch (err) {
        alert('Gagal memuat catatan');
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [id]);

  const handleCommentAdded = () => {
    setRefreshComments((prev) => !prev);
  };

  const handleBack = () => {
    setShowBackModal(true);
  };

  const confirmBack = () => {
    setShowBackModal(false);
    router.back();
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!note) return <p className="p-6 text-center">Catatan tidak ditemukan.</p>;

  return (
    <>
      <AnimatePresence>
        <motion.main
          className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Tombol Kembali */}
          <div className="flex justify-start mb-4">
            <button
              onClick={handleBack}
              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <h1 className="text-4xl font-bold mb-1">{note.title}</h1>
          <p className="text-gray-500 mb-4">
            <strong>Author:</strong> {note.userName || 'Unknown'}
          </p>

          <div className="text-gray-600 mb-6 whitespace-pre-wrap">{note.body}</div>

          <p>
            <strong>Tanggal Mulai:</strong> {note.startDate?.slice(0, 10) || '-'}
          </p>
          <p>
            <strong>Tanggal Selesai:</strong> {note.endDate?.slice(0, 10) || '-'}
          </p>

          {note.imageUrl && (
            <motion.img
              src={note.imageUrl}
              alt={note.title}
              className="mt-6 max-w-full rounded shadow"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* 💬 Komentar */}
          {token && (
            <CommentForm
              noteId={note.id}
              token={token}
              onSuccess={handleCommentAdded}
            />
          )}
          <CommentList
            noteId={note.id}
            token={token}
            userRole={userRole}
            refreshTrigger={refreshComments}
          />
        </motion.main>
      </AnimatePresence>

      {/* Modal Konfirmasi Kembali */}
      <ConfirmationModal
        isOpen={showBackModal}
        title="Kembali?"
        message="Apakah Anda yakin ingin kembali ke halaman sebelumnya?"
        onCancel={() => setShowBackModal(false)}
        onConfirm={confirmBack}
        confirmText="Ya, Kembali"
        cancelText="Batal"
      />
    </>
  );
}
