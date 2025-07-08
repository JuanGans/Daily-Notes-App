import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  FilePlus,
  Table,
  ListOrdered,
  Users,
  LogOut,
} from 'lucide-react'
import { useRouter } from 'next/router'

interface SidebarProps {
  selectedMenu: 'dashboard' | 'form' | 'table' | 'list' | 'users'
  onSelectMenu: (menu: SidebarProps['selectedMenu']) => void
}

const menus = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'form', label: 'Tambah Catatan', icon: FilePlus },
  { id: 'table', label: 'Daftar Catatan', icon: Table },
  { id: 'list', label: 'Semua Catatan', icon: ListOrdered },
]

const adminMenus = [{ id: 'users', label: 'Kelola Pengguna', icon: Users }]

export default function Sidebar({ selectedMenu, onSelectMenu }: SidebarProps) {
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setRole(payload.role)
    } catch (err) {
      console.error('❌ Invalid token format')
      localStorage.removeItem('token')
      router.push('/auth/login')
    }
  }, [router])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      router.push('/auth/login')
    }
  }

  if (role === null) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <aside className="w-44 bg-white border-r border-gray-200 min-h-screen flex flex-col p-4">
      <img
        src="https://i.ibb.co/JFv8xxpc/image.png"
        alt="My Notes Logo"
        className="h-10 w-auto mb-6 mx-auto"
      />

      <nav className="flex flex-col space-y-2">
        {[...menus, ...(role === 'ADMIN' ? adminMenus : [])].map((menu) => {
          const Icon = menu.icon
          return (
            <button
              key={menu.id}
              onClick={() => onSelectMenu(menu.id as SidebarProps['selectedMenu'])}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-left ${
                selectedMenu === menu.id
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {menu.label}
            </button>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:underline"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </aside>
  )
}
