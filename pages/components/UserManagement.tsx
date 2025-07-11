import { useEffect, useState } from 'react';
import EditUserModal from './EditUserModal';
import AddUserModal from './AddUserModal';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5001/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Gagal menghapus user');
      toast.success('User berhasil dihapus');
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (err) {
      toast.error('Gagal menghapus user');
    }
  };

return (
  <section className="px-4 py-6 max-w-7xl mx-auto">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Kelola Pengguna</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 border-collapse">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Nama</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="hover:bg-gray-50 text-center"
                >
                  <td className="border px-4 py-2">{i + 1}</td>
                  <td className="border px-4 py-2">{u.name}</td>
                  <td className="border px-4 py-2">{u.email}</td>
                  <td className="border px-4 py-2">{u.role}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="text-yellow-600 hover:text-yellow-700 transition"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => confirmDelete(u)}
                      className="text-red-600 hover:text-red-700 transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit User Modal */}
        {selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={fetchUsers}
          />
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <AddUserModal onClose={() => setShowAddModal(false)} onSave={fetchUsers} />
        )}
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={!!userToDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus user "${userToDelete?.name}"?`}
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
    </section>
  );
}
