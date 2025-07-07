import { useEffect, useState } from 'react';
import EditUserModal from './EditUserModal';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5001/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5001/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Gagal menghapus user');
      alert('User berhasil dihapus');
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert('Gagal menghapus user');
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Kelola Pengguna</h1>
      <table className="min-w-full border border-gray-300 border-collapse">
        <thead className="bg-blue-100 text-gray-700">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} className="hover:bg-gray-50 text-center">
              <td className="border px-4 py-2">{i + 1}</td>
              <td className="border px-4 py-2">{u.name}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.role}</td>
              <td className="border px-4 py-2 space-x-1">
                <button
                  onClick={() => setSelectedUser(u)}
                  className="text-yellow-600 hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="text-red-600 hover:underline"
                >
                  🗑 Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={fetchUsers}
        />
      )}
    </section>
  );
}
