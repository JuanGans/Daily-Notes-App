'use client';

import { Users, CalendarDays, ImageIcon, MessageCircle } from 'lucide-react';
import { HoverEffect } from './components/HoverEffect';
import { StarsBackground } from './backrounds/StarBackround';
import { ShootingStars } from './backrounds/ShootingStar';

const features = [
  {
    title: (
      <div className="flex flex-col items-center space-y-2">
        <Users size={40} className="text-purple-600" />
        <span>Multi-User</span>
      </div>
    ),
    description: 'Aplikasi mendukung banyak pengguna dengan role berbeda.',
    link: '#features',
  },
  {
    title: (
      <div className="flex flex-col items-center space-y-2">
        <CalendarDays size={40} className="text-purple-600" />
        <span>Filter Tanggal</span>
      </div>
    ),
    description: 'Temukan catatan berdasarkan waktu spesifik.',
    link: '#features',
  },
  {
    title: (
      <div className="flex flex-col items-center space-y-2">
        <ImageIcon size={40} className="text-purple-600" />
        <span>Upload Gambar</span>
      </div>
    ),
    description: 'Tambahkan visual menarik pada catatan kamu.',
    link: '#features',
  },
  {
    title: (
      <div className="flex flex-col items-center space-y-2">
        <MessageCircle size={40} className="text-purple-600" />
        <span>Komentar</span>
      </div>
    ),
    description: 'Tinggalkan komentar pada catatan tertentu.',
    link: '#features',
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-20 px-6 text-center text-purple-900 bg-gradient-to-b from-purple-200 via-purple-300 to-purple-400 overflow-hidden"
    >
      {/* ✨ Bintang dan shooting stars */}
      <StarsBackground className="absolute inset-0 z-0" />
      <ShootingStars className="absolute inset-0 z-0" />

      {/* ✍️ Konten utama */}
      <div className="relative max-w-6xl mx-auto z-10">
        <h2 className="text-3xl font-bold mb-12">Kenapa memilih Notes Daily?</h2>

        <HoverEffect
          items={features}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-4"
        />
      </div>
    </section>
  );
}
