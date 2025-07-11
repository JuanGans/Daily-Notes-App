'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ConfirmationModal from '../ConfirmationModal';

interface Comment {
  id: number;
  content: string;
  noteId: number;
  userId: number;
  userName?: string;
  createdAt: string;
}

interface Props {
  noteId: number;
  userRole: 'ADMIN' | 'USER';
  token: string | null;
  refreshTrigger: boolean;
}

export default function CommentList({ noteId, userRole, token, refreshTrigger }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5003/comments/note/${noteId}`);
      const data = await res.json();
      setComments(data);
    } catch {
      toast.error('Gagal memuat komentar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [noteId, refreshTrigger]);

  const handleDeleteConfirm = async () => {
    if (!selectedCommentId) return;
    try {
      const res = await fetch(`http://localhost:5003/comments/${selectedCommentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();
      toast.success('Komentar dihapus');
      setComments(comments.filter((c) => c.id !== selectedCommentId));
    } catch {
      toast.error('Gagal menghapus komentar');
    } finally {
      setShowConfirm(false);
      setSelectedCommentId(null);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-2">💬 Komentar</h3>
      {loading ? (
        <p>Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">Belum ada komentar.</p>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.li
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-100 p-4 rounded relative"
              >
                <p className="text-gray-800">{comment.content}</p>
                <div className="text-sm text-gray-500 mt-1">
                  Oleh: <strong>{comment.userName || 'User'}</strong> pada{' '}
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
                {userRole === 'ADMIN' && (
                  <button
                    onClick={() => {
                      setSelectedCommentId(comment.id);
                      setShowConfirm(true);
                    }}
                    className="absolute bottom-2 right-2 text-red-500 hover:text-red-700 p-1"
                    title="Hapus komentar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        title="Konfirmasi Hapus"
        message="Apakah kamu yakin ingin menghapus komentar ini?"
        onCancel={() => {
          setShowConfirm(false);
          setSelectedCommentId(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
