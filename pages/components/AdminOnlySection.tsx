import { getCurrentUser } from '../lib/auth'

export default function AdminOnlySection() {
  const user = getCurrentUser()

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="bg-white border p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold text-red-600 mb-2">👑 Admin Panel</h2>
      <p className="text-gray-700">This section is visible only to admins.</p>
      {/* Tambahkan fitur admin di sini, seperti statistik user, dll */}
    </div>
  )
}
