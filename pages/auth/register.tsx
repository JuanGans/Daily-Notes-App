import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import InteractiveLogo from '../components/InteractiveLogo/InteractiveLogo';

export default function RegisterPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5001/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Registrasi gagal');
        return;
      }

      toast.success('Registrasi berhasil! Silakan login');
      router.push('/auth/login');
    } catch (err) {
      console.error('Register error:', err);
      toast.error('Terjadi kesalahan saat registrasi');
    }
  };

  if (!isClient) return null; // 🧠 Hindari render di server

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://c1.wallpaperflare.com/preview/427/745/192/notebook-natural-laptop-macbook.jpg')] bg-cover bg-center font-sans">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-10 relative">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">Register</h2>

        <form className="space-y-4" onSubmit={handleRegister}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <input
            type="text"
            placeholder="Nama lengkap"
            className="w-full px-4 py-2 rounded border border-gray-300 text-black focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded border border-gray-300 text-black focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded border border-gray-300 text-black focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition">
            Daftar
          </button>

          <p className="mt-4 text-sm text-center text-white">
            Sudah punya akun?{' '}
            <a href="/auth/login" className="text-blue-300 underline">Login</a>
          </p>

            <div className="flex justify-center mt-6">
              <InteractiveLogo size="5px" isOpen={true} />
            </div>
        </form>
      </div>
    </div>
  );
}
