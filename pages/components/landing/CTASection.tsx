'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-purple-100 via-blue-100 to-purple-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Teks dan tombol di kiri */}
        <div className="flex flex-col items-start justify-center text-gray-900 w-full">
          <div className="w-full text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Sudah siap mencatat harimu?</h2>
            <p className="text-lg text-gray-800 mb-6">
              Daftar sekarang dan mulai pengalaman mencatat yang menyenangkan.
            </p>
          </div>
          <div className="w-full flex justify-center md:justify-start mt-2">
            <Link href="/auth/register">
              <button className="bg-white text-indigo-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow">
                Daftar Sekarang
              </button>
            </Link>
          </div>
        </div>

        {/* Gambar di kanan */}
        <div className="flex justify-center">
          <Image
            src="/Notes.jpg"
            alt="Note Image"
            width={500}
            height={400}
            className="rounded-xl shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
}
