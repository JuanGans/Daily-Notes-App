import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface NoteFormProps {
  onSuccess?: () => void;
  initialData?: {
    id?: number;
    title?: string;
    body?: string;
    startDate?: string; // format "dd-mm-yyyy"
    endDate?: string;
    imageUrl?: string;
  };
}

interface DecodedToken {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

// Helper: dd-mm-yyyy -> Date
const parseDMYtoDate = (value: string): Date | null => {
  const parts = value.split('-');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  const isoString = `${year}-${month}-${day}`;
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? null : date;
};

// Helper: Date -> dd-mm-yyyy
const formatDateToDMY = (date: Date | null): string => {
  if (!date) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function NoteForm({ onSuccess, initialData }: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [startDateRaw, setStartDateRaw] = useState<Date | null>(
    initialData?.startDate ? parseDMYtoDate(initialData.startDate) : null
  );
  const [endDateRaw, setEndDateRaw] = useState<Date | null>(
    initialData?.endDate ? parseDMYtoDate(initialData.endDate) : null
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [uploading, setUploading] = useState(false);
  const [userName, setUserName] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userId = decoded.id;

      fetch(`http://localhost:5001/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUserName(data.name || 'Pengguna'))
        .catch(() => setUserName('Pengguna'));
    } catch {
      setUserName('Pengguna');
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5002/notes/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setImageUrl(data.url);
      toast.success('Gambar berhasil diunggah!');
    } catch {
      toast.error('Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setBody('');
    setStartDate('');
    setEndDate('');
    setStartDateRaw(null);
    setEndDateRaw(null);
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !body || !startDate || !endDate) {
      toast.error('Semua field wajib diisi');
      return;
    }

    try {
      const token = localStorage.getItem('token') || '';
      const payload = { title, body, startDate, endDate, imageUrl };
      const endpoint = initialData?.id
        ? `http://localhost:5002/notes/${initialData.id}`
        : 'http://localhost:5002/notes';

      const method = initialData?.id ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(`Gagal menyimpan catatan: ${err.message || 'Unknown error'}`);
        return;
      }

      toast.success(initialData?.id ? 'Catatan berhasil diubah!' : 'Catatan berhasil ditambahkan!');

      if (initialData?.id) {
        onSuccess ? onSuccess() : router.push('/');
      } else {
        resetForm();
        onSuccess?.();
      }
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan catatan');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        {initialData?.id ? 'Edit Catatan' : 'Tambah Catatan'}
      </h2>

      {userName && (
        <p className="text-center text-sm text-gray-600 mb-4">
          Dibuat oleh: <strong>{userName}</strong>
        </p>
      )}

      <input
        type="text"
        placeholder="Judul catatan"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-md"
      />

      <textarea
        placeholder="Deskripsi catatan..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
          <DatePicker
            selected={startDateRaw}
            onChange={(date) => {
              setStartDateRaw(date);
              setStartDate(formatDateToDMY(date));
            }}
            dateFormat="dd-MM-yyyy"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
            placeholderText="Pilih tanggal mulai"
            maxDate={endDateRaw || undefined}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
          <DatePicker
            selected={endDateRaw}
            onChange={(date) => {
              setEndDateRaw(date);
              setEndDate(formatDateToDMY(date));
            }}
            dateFormat="dd-MM-yyyy"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
            placeholderText="Pilih tanggal selesai"
            minDate={startDateRaw || undefined}
          />
        </div>
      </div>

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full text-sm file:px-4 file:py-2 file:bg-blue-100 file:text-blue-700 file:rounded-md"
        />
        {uploading && <p className="text-sm mt-2 text-gray-500">Uploading...</p>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="mt-4 max-h-48 rounded shadow object-contain"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md"
      >
        {initialData?.id ? 'Update Catatan' : 'Tambah Catatan'}
      </button>
    </motion.form>
  );
}
