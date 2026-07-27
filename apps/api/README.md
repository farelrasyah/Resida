# RESIDA API — Backend Administrasi RT

REST API untuk aplikasi administrasi RT perumahan, dibangun dengan Laravel 13 (PHP 8.3).

## Fitur Utama

- **Penghuni (Resident):** CRUD data penghuni dengan upload foto KTP
- **Rumah (House):** CRUD data rumah dengan status dihuni/tidak dihuni
- **Penghunian (Occupancy):** Assign/reassign/riwayat penghuni ke rumah
- **Iuran (Payment):** Pencatatan pembayaran iuran bulanan/tahunan dengan breakdown periode
- **Pengeluaran (Expense):** CRUD data pengeluaran RT
- **Laporan (Report):** Summary tahunan, detail bulanan, dashboard

## Tech Stack

- **Framework:** Laravel 13
- **PHP:** 8.3+
- **Database:** MySQL 8.0+
- **Auth:** Laravel Sanctum (token-based)
- **Docs:** Swagger/OpenAPI via l5-swagger

## Instalasi

### Prasyarat

- PHP >= 8.3 dengan ekstensi: `mbstring`, `xml`, `ctype`, `json`, `bcmath`, `pdo_mysql`
- Composer 2.x
- MySQL 8.0+
- Node.js (opsional, untuk Vite asset)

### Langkah Instalasi

```bash
# 1. Clone repository
git clone <repository-url>
cd resida/apps/api

# 2. Install dependencies
composer install

# 3. Konfigurasi environment
cp .env.example .env
# Edit .env sesuai kredensial MySQL lokal Anda

# 4. Generate application key
php artisan key:generate

# 5. Buat database MySQL
mysql -u root -e "CREATE DATABASE resida CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 6. Jalankan migration dan seeder
php artisan migrate --seed

# 7. Buat symbolic link storage
php artisan storage:link

# 8. Jalankan server development
php artisan serve
```

### Data Seeder Default

| Data | Nilai |
|------|-------|
| Admin | admin@resida.com / password |
| Rumah | A-01 s.d. A-20 (20 rumah) |
| Iuran Satpam | Rp100.000/bulan |
| Iuran Kebersihan | Rp15.000/bulan (default tahunan) |

## API Documentation

Setelah server berjalan, akses Swagger UI di: `http://127.0.0.1:8000/api/documentation`

### Base URL

```
http://localhost:8000/api/v1
```

### Autentikasi

Semua endpoint (kecuali login) memerlukan header:

```
Authorization: Bearer {token}
```

Token didapatkan dari endpoint `POST /api/v1/auth/login`.

### Endpoint Utama

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| GET/POST | `/residents` | List/Create penghuni |
| GET/PUT | `/residents/{id}` | Show/Update penghuni |
| PATCH | `/residents/{id}/deactivate` | Nonaktifkan penghuni |
| GET/POST | `/houses` | List/Create rumah |
| GET/PUT | `/houses/{id}` | Show/Update rumah |
| POST | `/houses/{id}/assign-resident` | Assign penghuni |
| POST | `/houses/{id}/reassign-resident` | Reassign penghuni |
| GET | `/houses/{id}/occupancy-history` | Riwayat penghuni |
| GET | `/dues-types` | List jenis iuran |
| PUT | `/dues-types/{id}` | Update nominal |
| GET/POST | `/payments` | List/Create pembayaran |
| PATCH | `/payments/{id}/cancel` | Batalkan pembayaran |
| GET/POST | `/expenses` | List/Create pengeluaran |
| GET | `/reports/summary` | Laporan ringkasan tahunan |
| GET | `/reports/detail` | Laporan detail bulanan |
| GET | `/reports/dashboard` | Data dashboard |

## Testing

```bash
# Jalankan seluruh test
php artisan test

# Jalankan test spesifik
php artisan test --filter=PaymentControllerTest
```

## Arsitektur

```
Controller → Service → Repository → Model → MySQL
```

- **Controller:** HTTP orchestration (tipis, tanpa business logic)
- **Service:** Business logic, validasi bisnis, DB transaction
- **Repository:** Abstraksi query Eloquent
- **Model:** Representasi tabel, relasi, cast

## Timezone

Seluruh aplikasi menggunakan timezone **Asia/Jakarta**.
