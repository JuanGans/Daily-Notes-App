// /pages/index.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import NoteForm from './components/NoteForm'
import NoteTable from './components/NoteTable'
import NoteListView from './components/NoteListView'
import UserManagement from './components/UserManagement';



export default function Home() {
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'form' | 'table' | 'list' | 'users'>('dashboard')
  const router = useRouter()

  // ✅ Proteksi halaman
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
    }
  }, [router])

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar selectedMenu={activeMenu} onSelectMenu={setActiveMenu} />
      <main className="flex-1 p-8 overflow-auto">
        {activeMenu === 'dashboard' && <Dashboard />}
        {activeMenu === 'form' && <NoteForm />}
        {activeMenu === 'table' && <NoteTable />}
        {activeMenu === 'list' && <NoteListView />}
        
        {activeMenu === 'users' && <UserManagement />}
      </main>
    </div>
  )
}
