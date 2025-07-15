import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import InteractiveLogo from '../components/InteractiveLogo/InteractiveLogo';

export default function LoginPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  try {
    const res = await fetch('http://localhost:5001/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const contentType = res.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      toast.error('Server mengembalikan format yang tidak valid.');
      console.error('Respon bukan JSON:', await res.text());
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || 'Login gagal');
      return;
    }

    localStorage.setItem('token', data.token);
    toast.success('Login berhasil!');
    router.push('/home');
  } catch (err) {
    console.error('Login error:', err);
    toast.error('Terjadi kesalahan saat login');
  }
};

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://c0.wallpaperflare.com/preview/128/594/372/agenda-book-calendar-daily.jpg')] bg-cover bg-center font-sans">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-10 relative">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">Login</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              className="w-full px-4 py-2 mt-1 rounded border border-gray-300 text-black focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="******"
                className="w-full px-4 py-2 mt-1 rounded border border-gray-300 text-black focus:ring-2 focus:ring-blue-400 pr-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition">
            Login
          </button>

          <button type="button" onClick={() => router.push('/auth/register')} className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700">
            Daftar
          </button>

          <div className="flex justify-center mt-6">
            <a href="/" aria-label="Kembali ke halaman utama">
              <InteractiveLogo size="5px" isOpen={true} />
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
