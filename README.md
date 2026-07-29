# RESIDA - Residential Management System

RESIDA (Residential Management System) adalah aplikasi sistem informasi manajemen administrasi Rukun Tetangga (RT) dan Rukun Warga (RW) yang dirancang untuk mendigitalkan dan mengotomatiskan proses tata kelola data warga, pendataan rumah, hingga manajemen keuangan lingkungan secara terpusat dan terintegrasi.

---

## 2. Tentang Project

Aplikasi RESIDA dibangun sebagai solusi atas permasalahan administrasi manual yang sering terjadi di tingkat rukun tetangga, seperti pendataan warga yang tidak rapi, transparansi keuangan yang kurang, serta sulitnya melacak riwayat pembayaran iuran warga.

Tujuan utama sistem ini adalah menyediakan platform terpadu bagi pengurus RT (Ketua RT, Bendahara, dan Sekretaris) untuk:
- Mengelola data penghuni dan status kepemilikan atau sewa hunian.
- Mencatat secara sistematis pemasukan iuran rutin warga dan pengeluaran operasional.
- Menghasilkan laporan keuangan yang akurat, terstruktur, dan siap cetak (*print-ready*) dengan standar korporasi.

Project ini juga diimplementasikan sebagai bagian dari pemenuhan **BEON Skill Fit Test**, yang mendemonstrasikan kapabilitas pengembangan sistem berskala produksi menggunakan arsitektur modern berbasis API (Backend API dan Frontend Single Page Application).

---

## 3. Fitur

Berikut adalah daftar fitur utama yang tersedia di dalam RESIDA:

- **Dashboard Utama**: Pusat kendali dan pemantauan statistik utama lingkungan dalam satu halaman ringkas dan interaktif.
- **Manajemen Penghuni**: Modul untuk mendata informasi penghuni dengan fitur *Soft Delete* (Deaktivasi).
- **Manajemen Rumah**: Modul untuk mendata unit rumah, menempatkan penghuni, dan memonitor status hunian.
- **Riwayat Rumah & Penghuni**: Pelacakan histori penempatan hunian dan histori pembayaran berdasarkan tiap rumah.
- **Jenis Iuran**: Pengelolaan besaran nominal dan metadata untuk berbagai tipe tagihan bulanan.
- **Pembayaran**: Modul pencatatan transaksi masuk dari warga.
- **Pembatalan Transaksi**: Fasilitas pembatalan pembayaran (Cancel) jika terdapat kesalahan administrasi.
- **Pengeluaran**: Modul pencatatan arus kas keluar (Expenses) untuk biaya operasional lingkungan dengan dukungan *soft delete* / deaktivasi.
- **Laporan Keuangan & Laporan PDF**: 
  - *Ringkasan Tahunan*: Visualisasi data pemasukan, pengeluaran, dan saldo kas.
  - *Detail Bulanan*: Matriks pelacakan status pelunasan (lunas/tunggakan) iuran per rumah.
  - Cetak laporan PDF dan Kwitansi Pembayaran resmi.
- **Swagger API Documentation**: Dokumentasi interaktif dari keseluruhan *endpoint* REST API.
- **Authentication**: Pengamanan *endpoint* dan *client* menggunakan Laravel Sanctum Token.

---

## 4. Tech Stack

Aplikasi ini dibangun dengan arsitektur *Monorepo* yang berisi dua sistem terpisah (Frontend dan Backend):

### Backend (REST API)

| Teknologi | Keterangan |
| :--- | :--- |
| Framework | Laravel 13 |
| Bahasa | PHP 8.3+ |
| Authentication | Laravel Sanctum (Personal Access Token) |
| API Docs | L5-Swagger (OpenAPI 3.0) |

### Frontend (SPA)

| Teknologi | Keterangan |
| :--- | :--- |
| Framework | React 19 |
| Bahasa | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 4 |
| HTTP Client | Native Fetch API |
| Routing | React Router v7 |

### Database & Development Tools

| Teknologi | Keterangan |
| :--- | :--- |
| RDBMS | MySQL 8.0+ |
| Package Manager (PHP) | Composer 2.0+ |
| Package Manager (JS) | pnpm 11.1+ (Workspaces) |
| Version Control | Git |

---

## 5. Project Structure

Aplikasi ini dikelola dalam satu *repository* tunggal (Monorepo) menggunakan konfigurasi `pnpm-workspace`.

```text
resida/
├── apps/
│   ├── api/               # Source code Backend (Laravel 13 REST API)
│   └── web/               # Source code Frontend (React 19 SPA)
├── pnpm-workspace.yaml    # Konfigurasi Monorepo pnpm
├── package.json           # Global scripts untuk Frontend & Workspace
└── README.md              # Dokumentasi proyek
```

---

## 6. Prasyarat

Sebelum memulai proses instalasi, pastikan sistem Anda telah memasang perangkat lunak berikut:

- **PHP**: ^8.3
- **Composer**: Versi terbaru
- **Node.js**: Versi 20.x atau lebih baru
- **pnpm**: ^11.1.1
- **MySQL**: ^8.0
- **Git**

---

## 7. Panduan Instalasi

Lakukan langkah-langkah instalasi secara berurutan dari kondisi komputer kosong:

### Tahap 1: Persiapan Repository & Workspace

Kloning repository ke mesin lokal Anda, kemudian masuk ke folder proyek utama.

```bash
git clone https://github.com/farelrasyah/resida.git
cd resida
```

Install seluruh pustaka dependencies untuk *Frontend* menggunakan fitur *workspace* dari pnpm.

```bash
pnpm install
```

### Tahap 2: Setup Backend (API)

Masuk ke direktori backend.

```bash
cd apps/api
```

Install pustaka dependencies PHP.

```bash
composer install
```

Salin file konfigurasi *environment*.

```bash
cp .env.example .env
```

Buat *Application Key*.

```bash
php artisan key:generate
```

Siapkan database kosong di MySQL Anda (misalnya dengan nama `resida`). Kemudian atur kredensial koneksi database pada file `.env` di direktori `apps/api`. Jika sudah, jalankan migrasi beserta data sampel (seeder).

```bash
php artisan migrate:fresh --seed
```

Buat *symlink* untuk direktori *storage* agar file unggahan dapat diakses secara publik.

```bash
php artisan storage:link
```

### Tahap 3: Setup Frontend (Web)

Buka tab terminal baru. Masuk ke direktori frontend.

```bash
cd apps/web
```

Salin file konfigurasi *environment*.

```bash
cp .env.example .env
```

Sesuaikan nilai di file `.env` (lihat panduan di section selanjutnya).

---

## 8. Konfigurasi Environment

Aplikasi memerlukan penyesuaian pada file `.env` di masing-masing sub-proyek.

### Backend (`apps/api/.env`)

```env
APP_NAME=Resida
APP_URL=http://localhost:8000

# Konfigurasi Koneksi Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=resida
DB_USERNAME=root
DB_PASSWORD=

# Mengizinkan domain Frontend untuk berkomunikasi bebas hambatan dengan Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:5173

FILESYSTEM_DISK=public
```

### Frontend (`apps/web/.env`)

```env
# URL dasar untuk request Native Fetch API ke backend (HARUS menggunakan /api/v1)
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Nama Aplikasi yang Tampil di Title Bar
VITE_APP_NAME="Sistem Administrasi RT RESIDA"
```

---

## 9. Database

Perintah-perintah penting *artisan* untuk manajemen database dari dalam direktori `apps/api`:

- Menjalankan migrasi (*schema building*): `php artisan migrate`
- Membatalkan (*rollback*) migrasi terakhir: `php artisan migrate:rollback`
- Mengosongkan database dan mengulang migrasi: `php artisan migrate:fresh`
- Mengosongkan database sekaligus mengisi ulang data awal (*seeder*): `php artisan migrate:fresh --seed`

---

## 10. Storage

Sistem ini mendukung pengunggahan dokumen (*upload KTP*).

- Keseluruhan file yang diunggah akan disimpan di direktori `apps/api/storage/app/public/`.
- Agar file dapat diakses publik, *symlink* harus ada. Jalankan: `php artisan storage:link`.
- Jika gambar tidak tampil (Broken Image) atau merespons `404`, pastikan pengaturan `APP_URL` di backend sama persis dengan *domain* / *port* yang Anda gunakan untuk menjalankan server PHP (misalnya: `http://localhost:8000`), lalu periksa ulang keberadaan *storage link*.

---

## 11. Swagger API Documentation

Proyek ini dilengkapi dengan dokumentasi API interaktif menggunakan `L5-Swagger`.

- **Akses URL**: Buka `http://localhost:8000/api/documentation`
- **Generasi Ulang**: Setiap kali ada perubahan blok anotasi di *controller* backend, jalankan perintah ini di dalam `apps/api`:

```bash
php artisan l5-swagger:generate
```

---

## 12. Authentication

Sistem menggunakan **Laravel Sanctum (Personal Access Token)** untuk autentikasi API. Tidak menggunakan JWT atau HTTP Sessions *stateful*.

- *Client* melakukan *request* ke *endpoint* `/api/v1/auth/login`.
- *Server* memvalidasi kredensial dan mengembalikan sebuah string **Token** `Bearer`.
- Token tersebut disimpan di `localStorage` (*Frontend*) dan wajib disertakan di *Header HTTP* setiap *request* ke *endpoint* tertutup.

Contoh *Header*:
```text
Authorization: Bearer 1|abcdef123456...
Accept: application/json
```

---

## 13. Menjalankan Project

Ikuti prosedur standar berikut untuk mulai bekerja:

1. **Jalankan Backend**:
   Buka terminal di lokasi `apps/api/` dan eksekusi:
   ```bash
   php artisan serve
   ```
2. **Jalankan Frontend**:
   Buka tab terminal baru di *root* direktori `resida` dan eksekusi:
   ```bash
   pnpm run dev:web
   ```
   (Atau bisa juga masuk ke `apps/web` lalu jalankan `pnpm run dev`).
3. **Akses Aplikasi**: Buka browser dan pergi ke `http://localhost:5173`.

---

## 14. Default Account

Jika Anda telah menjalankan instalasi database dengan penanda `--seed`, sistem secara otomatis memuat data dari `UserSeeder`. Gunakan kredensial berikut untuk melakukan login sebagai Administrator RT:

- **Email**: `admin@resida.com`
- **Password**: `password`

---

## 15. API Overview

Semua *endpoint* berada di bawah prefix `/api/v1`. Berikut adalah pengelompokan sumber dayanya:

- **Auth**: `login`, `logout`, `me`.
- **Dues Types**: Index dan update jenis iuran (tagihan rutin/sukarela).
- **Expenses**: Catat pengeluaran kas (CRUD) menggunakan konsep *Soft Delete* (`/deactivate`).
- **Houses**: Pendataan status hunian rumah, riwayat warga (`occupancy-history`), dan deaktivasi unit. Mendukung *Assign* dan *Reassign* warga ke unit hunian.
- **Payments**: Registrasi transaksi (pembayaran satu atau banyak periode). Memiliki fitur Batalkan Tagihan (`/cancel`) jika salah input.
- **Reports**: Kalkulasi statistik `dashboard`, metrik kelunasan matriks bulanan (`detail`), dan laporan akumulasi tahunan (`summary`).
- **Residents**: Data warga. Memiliki endpoint `/deactivate` untuk mengubah warga aktif menjadi nonaktif (Tidak menggunakan operasi Delete fisik).

---

## 16. Troubleshooting

Kendala umum yang sering ditemui selama *setup* lokal:

- **Migration Gagal (Access Denied / No Database)**:
  Pastikan *service* MySQL menyala dan database kosong (contoh: `resida`) sudah benar-benar dibuat sebelum menjalankan `php artisan migrate`. Pastikan `DB_USERNAME` dan `DB_PASSWORD` di `.env` sesuai.
- **Frontend Gagal Mengambil Data (CORS Error)**:
  Pastikan nilai `VITE_API_BASE_URL` di Frontend `.env` mengarah dengan tepat ke `http://localhost:8000/api/v1` (tanpa tanda kutip atau *slash* ekstra). Dan di Backend `.env`, variabel `SANCTUM_STATEFUL_DOMAINS` harus `localhost:5173`.
- **Vite Failed to Load / Depedencies Missing**:
  Terjadi akibat *node_modules* korup. Solusinya, masuk ke root `resida/` dan eksekusi:
  ```bash
  rm -rf node_modules pnpm-lock.yaml apps/web/node_modules
  pnpm install
  ```
- **File Storage 403 / Gambar Tidak Tampil**:
  Hapus *symlink* `public/storage` jika sebelumnya salah terbuat, lalu eksekusi ulang `php artisan storage:link`.
- **Swagger Documentation Kosong / Error**:
  Jalankan `php artisan l5-swagger:generate` di folder `apps/api`. Pastikan direktori *storage* memiliki izin *Write*.
- **Route / Config Backend Tidak Terbaca (Cached)**:
  Jika perubahan `.env` backend tidak berefek, bersihkan seluruh cache Laravel:
  ```bash
  php artisan optimize:clear
  ```

---

## 17. Build Production

Tahap pengumpulan aset statis untuk peluncuran (*deployment*).

### Build Frontend
Melalui *root* direktori `resida`:
```bash
pnpm run build:web
```
Perintah ini mengeksekusi `tsc -b && vite build` dan akan menghasilkan folder `apps/web/dist/` berisikan HTML/CSS/JS statis yang telah diminifikasi, siap untuk disajikan di Nginx/Vercel.

### Optimasi Backend
Di dalam folder `apps/api/`, eksekusi perintah caching untuk memangkas *overhead*:
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 18. License

Hak cipta dilindungi. Proyek ini didistribusikan di bawah **MIT License**.

---

## 19. Author

- **Project Name**: RESIDA (Residential Management System)
- **Developer**: Farel Rasyah
- **Repository**: Terbuka dan dilindungi.
