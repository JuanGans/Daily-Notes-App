# Notes App - Aplikasi Catatan Harian dengan Next.js & Prisma

Aplikasi catatan harian sederhana yang memungkinkan pengguna untuk membuat, melihat, mengedit, dan menghapus catatan lengkap dengan fitur upload gambar. Dibangun menggunakan **Next.js**, **TypeScript**, dan **Prisma ORM** dengan database PostgreSQL.

---

## Fitur Utama

- CRUD Catatan (Create, Read, Update, Delete)
- Upload gambar untuk setiap catatan
- Daftar catatan dalam tampilan grid dan tabel
- Dashboard dengan statistik jumlah catatan dan 3 catatan acak
- Pagination pada daftar catatan
- API backend menggunakan Next.js API Routes
- Penyimpanan data menggunakan PostgreSQL dan Prisma ORM
- Styling responsif menggunakan Tailwind CSS

---

## Teknologi

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---
## Struktur Proyek
/components
├─ NoteForm.tsx         # Form tambah & edit catatan, termasuk upload gambar
├─ NoteListView.tsx     # Daftar catatan dalam grid 2 kolom dengan gambar
├─ NoteTable.tsx        # Daftar catatan dalam tabel dengan aksi edit/hapus
├─ Dashboard.tsx        # Halaman dashboard dengan statistik & catatan acak
├─ Sidebar.tsx          # Sidebar navigasi aplikasi

/pages
├─ api
│  ├─ notes
│  │  ├─ [id].ts       # API GET, PUT, DELETE catatan berdasarkan ID
│  │  ├─ index.ts      # API GET daftar catatan dengan pagination
│  │  ├─ upload.ts     # API upload gambar & mengembalikan URL gambar
├─ index.tsx            # Halaman utama dengan menu & konten utama

/prisma
├─ schema.prisma        # Definisi model database (Note)

---

## Instalasi dan Setup

1. Clone repositori ini:

```bash
git clone https://github.com/username/notes-app.git
cd notes-app

2. Install dependencies:

npm install
# atau
yarn install

3. Setup database PostgreSQL dan buat database baru, misal notesdb.

4. Buat file .env di root project dan isi dengan konfigurasi database:
DATABASE_URL="postgresql://user:password@localhost:5432/notesdb"

5. Jalankan migrasi Prisma untuk membuat tabel di database:
npx prisma migrate dev --name init

6. Jalankan aplikasi Next.js secara lokal:
npm run dev
# atau
yarn dev

7. Buka browser dan akses http://localhost:3000

Cara Menggunakan Aplikasi:
Dashboard: Melihat jumlah total catatan dan 3 catatan harian acak.

Tambah Catatan: Gunakan form untuk membuat catatan baru, lengkap dengan upload gambar.

Daftar Catatan: Melihat semua catatan dalam bentuk tabel dengan opsi edit dan hapus.

Edit Catatan: Klik edit untuk memperbarui catatan termasuk mengganti gambar.

Hapus Catatan: Hapus catatan yang tidak diperlukan.

Navigasi Sidebar: Mudah berpindah antar halaman.

API Endpoints
GET /api/notes?page=&limit= — Mengambil daftar catatan dengan pagination.

GET /api/notes/[id] — Mengambil detail catatan berdasarkan ID.

POST /api/notes — Menambah catatan baru.

PUT /api/notes/[id] — Memperbarui catatan berdasarkan ID.

DELETE /api/notes/[id] — Menghapus catatan berdasarkan ID.

POST /api/notes/upload — Upload gambar, mengembalikan URL untuk disimpan pada catatan.

Penjelasan Singkat Kode
NoteForm.tsx: Komponen form untuk tambah/edit catatan dengan input judul, deskripsi, tanggal mulai & selesai, dan upload gambar.

NoteListView.tsx: Komponen untuk menampilkan daftar catatan dalam tampilan grid yang responsif dengan preview gambar.

NoteTable.tsx: Menampilkan daftar catatan dalam tabel lengkap dengan tombol aksi Edit dan Delete.

Dashboard.tsx: Menampilkan total catatan dan 3 catatan acak dengan highlight.

Sidebar.tsx: Komponen navigasi vertikal dengan pilihan menu Dashboard, Tambah Catatan, dan Daftar Catatan.

API Routes: File di /pages/api/notes menangani logika CRUD dan upload gambar dengan Prisma sebagai ORM.