import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NoteForm from './components/NoteForm';
import NoteTable from './components/NoteTable';
import NoteListView from './components/NoteListView'; // ✅ Tambahan

export default function Home() {
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'form' | 'table' | 'list'>('dashboard'); // ✅ Tambahan 'list'

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar selectedMenu={activeMenu} onSelectMenu={setActiveMenu} />
      <main className="flex-1 p-8 overflow-auto">
        {activeMenu === 'dashboard' && <Dashboard />}
        {activeMenu === 'form' && <NoteForm />}
        {activeMenu === 'table' && <NoteTable />}
        {activeMenu === 'list' && <NoteListView />} {/* ✅ Tambahan */}
      </main>
    </div>
  );
}
