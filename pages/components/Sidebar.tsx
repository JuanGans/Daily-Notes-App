'use client' // jika kamu pakai app router, tapi aman disimpan juga di pages router

import { useEffect, useState } from 'react'

interface SidebarProps {
  selectedMenu: 'dashboard' | 'form' | 'table' | 'list' | 'users'
  onSelectMenu: (menu: SidebarProps['selectedMenu']) => void
}

const menus = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'form', label: 'Tambah Catatan' },
  { id: 'table', label: 'Daftar Catatan' },
  { id: 'list', label: 'Semua Catatan' },
]

const adminMenus = [{ id: 'users', label: 'Kelola Pengguna' }]

export default function Sidebar({ selectedMenu, onSelectMenu }: SidebarProps) {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    // Ambil role dari JWT token di localStorage
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setRole(payload.role)
      } catch (err) {
        console.error('❌ Invalid token format')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/auth/login'
  }

  // Render kosong dulu sampai role tersedia agar hindari mismatch SSR/CSR
  if (role === null) return null

  return (
    <aside className="w-44 bg-white border-r border-gray-200 min-h-screen flex flex-col p-4">
      <h2 className="text-xl font-semibold mb-6 text-blue-600">My Notes</h2>
      <nav className="flex flex-col space-y-2">
        {[...menus, ...(role === 'ADMIN' ? adminMenus : [])].map((menu) => (
          <button
            key={menu.id}
            onClick={() => onSelectMenu(menu.id as SidebarProps['selectedMenu'])}
            className={`text-left px-3 py-2 rounded-md transition-colors duration-200 ${
              selectedMenu === menu.id
                ? 'bg-blue-600 text-white font-semibold shadow'
                : 'text-gray-700 hover:bg-blue-100'
            }`}
          >
            {menu.label}
          </button>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto px-3 py-2 text-sm text-red-600 hover:underline"
      >
        Logout
      </button>
    </aside>  
  )
}
