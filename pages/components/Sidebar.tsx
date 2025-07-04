import React from 'react';

interface SidebarProps {
  selectedMenu: 'dashboard' | 'form' | 'table' | 'list'; // Tambahkan 'list'
  onSelectMenu: (menu: 'dashboard' | 'form' | 'table' | 'list') => void; // Tambahkan 'list'
}

const menus = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'form', label: 'Tambah Catatan' },
  { id: 'table', label: 'Daftar Catatan' },
  { id: 'list', label: 'Semua Catatan' }, // 🔥 Tambahkan ini
];

export default function Sidebar({ selectedMenu, onSelectMenu }: SidebarProps) {
  return (
    <aside className="w-44 bg-white border-r border-gray-200 min-h-screen flex flex-col p-4">
      <h2 className="text-xl font-semibold mb-6 text-blue-600">My Notes</h2>
      <nav className="flex flex-col space-y-2">
        {menus.map((menu) => (
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
      <div className="mt-auto text-xs text-gray-400 px-3 py-2">&copy; 2025 NotesApp</div>
    </aside>
  );
}
