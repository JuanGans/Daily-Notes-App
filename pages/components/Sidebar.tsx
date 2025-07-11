import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FilePlus,
  Table,
  ListOrdered,
  Users,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/router';
import InteractiveLogo from '../components/InteractiveLogo/InteractiveLogo';
import { motion } from 'framer-motion';
import Tooltip from '../components/ui/Tooltip';
import ConfirmationModal from '../components/ConfirmationModal';

interface SidebarProps {
  selectedMenu: 'dashboard' | 'form' | 'table' | 'list' | 'users';
  onSelectMenu: (menu: SidebarProps['selectedMenu']) => void;
}

const menus = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'form', label: 'Tambah Catatan', icon: FilePlus },
  { id: 'table', label: 'Daftar Catatan', icon: Table },
  { id: 'list', label: 'Semua Catatan', icon: ListOrdered },
];

const adminMenus = [{ id: 'users', label: 'Kelola Pengguna', icon: Users }];

export default function Sidebar({ selectedMenu, onSelectMenu }: SidebarProps) {
  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
    } catch (err) {
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  if (role === null) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <motion.aside
        animate={{ width: isOpen ? 256 : 80 }}
        transition={{ duration: 0.4 }}
        className="bg-white border-r border-gray-200 h-screen flex flex-col p-4 overflow-hidden justify-between"
      >
        <InteractiveLogo
          className="mb-6 mx-auto"
          size="6px"
          isOpen={isOpen}
          toggle={toggleSidebar}
        />

        <div className="flex flex-col justify-between flex-grow">
          <nav className="flex flex-col space-y-2">
            {[...menus, ...(role === 'ADMIN' ? adminMenus : [])].map((menu) => {
              const Icon = menu.icon;
              const menuBtn = (
                <button
                  key={menu.id}
                  onClick={() => onSelectMenu(menu.id as SidebarProps['selectedMenu'])}
                  className={`flex items-center ${
                    isOpen ? 'justify-start' : 'justify-center'
                  } gap-2 px-3 py-2 rounded-md transition-all duration-300 ${
                    selectedMenu === menu.id
                      ? 'bg-blue-600 text-white font-semibold shadow'
                      : 'text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isOpen && <span>{menu.label}</span>}
                </button>
              );
              return isOpen ? menuBtn : <Tooltip key={menu.id} label={menu.label}>{menuBtn}</Tooltip>;
            })}
          </nav>

          <div className="pt-4 border-t border-gray-200">
            {isOpen ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center justify-start w-full gap-2 px-3 py-2 rounded-md transition-all duration-300 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Tooltip label="Logout">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex justify-center items-center w-full py-2 rounded-md transition-all duration-300 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </motion.aside>

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin logout?"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        confirmText="Ya, Logout"
        cancelText="Batal"
      />
    </>
  );
}
