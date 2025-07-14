import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="bg-indigo-700 text-white text-center py-16 px-4">
      <h2 className="text-3xl font-bold mb-4">Sudah siap mencatat harimu?</h2>
      <p className="mb-6 text-lg">Daftar sekarang dan mulai pengalaman mencatat yang menyenangkan.</p>
      <Link href="/auth/register">
        <button className="bg-white text-indigo-700 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
          Daftar Sekarang
        </button>
      </Link>
    </section>
  )
}
