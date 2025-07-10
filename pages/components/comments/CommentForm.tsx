'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  noteId: number;
  token: string;
  onSuccess: () => void;
}

export default function CommentForm({ noteId, token, onSuccess }: Props) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Komentar tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5003/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, noteId }),
      });

      if (!res.ok) throw new Error();
      setContent('');
      toast.success('Komentar berhasil ditambahkan');
      onSuccess();
    } catch {
      toast.error('Gagal menambahkan komentar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Tulis komentar..."
      ></textarea>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Mengirim...' : 'Kirim Komentar'}
      </button>
    </form>
  );
}
