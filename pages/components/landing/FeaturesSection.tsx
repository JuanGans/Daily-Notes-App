import { motion } from 'framer-motion'
import { Users, CalendarDays, ImageIcon, MessageCircle } from 'lucide-react'

const features = [
  { icon: <Users size={40} />, title: 'Multi-User', desc: 'Aplikasi mendukung banyak pengguna dengan role berbeda.' },
  { icon: <CalendarDays size={40} />, title: 'Filter Tanggal', desc: 'Temukan catatan berdasarkan waktu spesifik.' },
  { icon: <ImageIcon size={40} />, title: 'Upload Gambar', desc: 'Tambahkan visual menarik pada catatan kamu.' },
  { icon: <MessageCircle size={40} />, title: 'Komentar', desc: 'Tinggalkan komentar pada catatan tertentu.' },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-12">Kenapa memilih Notes Daily?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="p-6 rounded-xl border shadow-md hover:shadow-lg transition"
          >
            <div className="mb-4 text-indigo-600">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
