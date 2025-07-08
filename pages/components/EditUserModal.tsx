import { useState } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

interface Props {
  user: User;
  onClose: () => void;
  onSave: () => void;
}

export default function EditUserModal({ user, onClose, onSave }: Props) {
  const isNew = user.id === 0;
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [role, setRole] = useState<'USER' | 'ADMIN'>(user.role || 'USER');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token tidak ditemukan');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        isNew
          ? 'http://localhost:5001/users'
          : `http://localhost:5001/users/${user.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            role,
            ...(password && { password }),
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal menyimpan data user');
      }

      toast.success(
        isNew ? 'Pengguna berhasil ditambahkan!' : 'Pengguna berhasil diperbarui!'
      );
      onSave();
      onClose();
    } catch (err) {
      toast.error((err as Error).message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {isNew ? 'Tambah Pengguna' : 'Edit Pengguna'}
        </h2>

        <div className="space-y-3">
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Password (kosongkan jika tidak diubah)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
