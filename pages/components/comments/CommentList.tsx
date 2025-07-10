'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

export default function CommentList({ noteId, userRole, token }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [noteId]);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Yakin ingin menghapus komentar ini?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5003/comments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();
      toast.success('Komentar dihapus');
      setComments(comments.filter((c) => c.id !== id));
    } catch {
      toast.error('Gagal menghapus komentar');
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
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-100 p-4 rounded relative">
              <p className="text-gray-800">{comment.content}</p>
              <div className="text-sm text-gray-500 mt-1">
                Oleh: <strong>{comment.userName || 'User'}</strong> pada{' '}
                {new Date(comment.createdAt).toLocaleString()}
              </div>
              {userRole === 'ADMIN' && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="absolute top-2 right-2 text-red-500 hover:underline text-sm"
                >
                  Hapus
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
