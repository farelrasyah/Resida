# AUDIT BACKEND RESIDA API v1.0.0

## 1. Audit Struktur & Konfigurasi

- **Monorepo structure**: Confirmed at `/home/farelrasyah/Projects/Website/resida/apps/web` and `/home/farelrasyah/Projects/Website/resida/apps/api`.
- **Framework & Dependencies**:
  - Laravel v13, PHP 8.2+
  - Auth package: Laravel Sanctum (`auth:sanctum` middleware)
- **Base URL Prefix**: `/api/v1`
- **CORS & Middleware**:
  - Prepend middleware: `ForceJsonResponse::class` in `bootstrap/app.php` (ensures `Accept: application/json` header behavior).
  - Rate Limiting: `throttle:60,1` (60 requests per minute).
  - Sanctum Stateful Domains configured in `.env.example` for `localhost:5173`.
- **Global API Response Envelope**:
  - Success: `{ "success": true, "message": string, "data": mixed }`
  - Paginated Success: `{ "success": true, "message": string, "data": { "items": [...], "pagination": { "current_page": int, "per_page": int, "total": int, "last_page": int } } }`
  - Error: `{ "success": false, "message": string, "errors"?: object }` (HTTP status codes: 400, 401, 404, 409, 422, 500)

---

## 2. Audit Endpoint & Kontrak Field Data

### 2.1 Authentication
1. `POST /api/v1/auth/login` (Public)
   - **Request**: `{ "email": "admin@resida.com", "password": "password" }`
   - **Validation**: Email required (email format), Password required.
   - **Response 200**: `{ "success": true, "message": "Login berhasil", "data": { "token": "...", "user": { "id": 1, "name": "Admin RT", "email": "admin@resida.com" } } }`
   - **Response 401**: `{ "success": false, "message": "Email atau password salah" }`
   - **Seeder default**: User `admin@resida.com` / `password`.
2. `POST /api/v1/auth/logout` (Bearer Auth)
   - **Response 200**: `{ "success": true, "message": "Logout berhasil", "data": null }`
3. `GET /api/v1/health` (Public)
   - **Response 200**: `{ "success": true, "message": "RESIDA API is running.", "version": "v1" }`

### 2.2 Residents (Penghuni)
1. `GET /api/v1/residents`
   - Query params: `search` (string), `resident_status` ('kontrak'|'tetap'), `sort` ('full_name', 'created_at', 'resident_status', prefix `-` for desc), `page` (int, default 1), `per_page` (int, default 15, max 100).
   - Response 200: Paginated `ResidentResource` list.
2. `POST /api/v1/residents` (multipart/form-data)
   - Request fields:
     - `full_name`: required, string, max:255
     - `ktp_photo`: required, file, mimes:jpg,jpeg,png, max:2048 (2MB)
     - `resident_status`: required, enum ('kontrak'|'tetap')
     - `phone_number`: required, numeric, digits:10-15
     - `marital_status`: required, enum ('sudah_menikah'|'belum_menikah')
   - Response 201: `ResidentResource` item.
3. `GET /api/v1/residents/{id}`
   - Response 200: `ResidentResource` item with `current_house` if occupied.
4. `PUT /api/v1/residents/{id}` (multipart/form-data)
   - Request fields: same as POST, except `ktp_photo` is optional (nullable).
   - Response 200: Updated `ResidentResource`.
5. `PATCH /api/v1/residents/{id}/deactivate`
   - Deactivates (soft delete) resident. Returns 409 if resident has active occupancy.

### 2.3 Houses (Rumah)
1. `GET /api/v1/houses`
   - Query params: `search` (house_number), `occupancy_status` ('dihuni'|'tidak_dihuni'), `sort` ('house_number', 'created_at', 'occupancy_status'), `page`, `per_page`.
   - Response 200: Paginated `HouseResource`.
2. `POST /api/v1/houses`
   - Request fields: `house_number` (required, max:50, unique).
   - Response 201: `HouseResource`.
3. `GET /api/v1/houses/{id}`
   - Response 200: `HouseDetailResource` (includes `active_resident`: `{ id, full_name, resident_status, since }`).
4. `PUT /api/v1/houses/{id}`
   - Request fields: `house_number` (required, max:50, unique except current).
   - Response 200: `HouseResource`.
5. `PATCH /api/v1/houses/{id}/deactivate`
   - Soft deletes house. Returns 409 if currently occupied.
6. `GET /api/v1/houses/{id}/occupancy-history`
   - Response 200: Collection of `OccupancyResource`.
7. `GET /api/v1/houses/{id}/payment-history`
   - Query params: `dues_type_id`, `year`.
   - Response 200: Collection of `PaymentResource`.
8. `POST /api/v1/houses/{id}/assign-resident`
   - Request: `{ "resident_id": int }`.
   - Assigns resident to vacant house. Returns 409 if house occupied or resident already active.
9. `POST /api/v1/houses/{id}/reassign-resident`
   - Request: `{ "resident_id": int }`.
   - Closes current occupancy and assigns new resident. Returns 409 if new resident already active.

### 2.4 Dues Types (Jenis Iuran)
1. `GET /api/v1/dues-types`
   - Response 200: List of `DuesTypeResource` (`code`: 'satpam'|'kebersihan', `amount`, `default_frequency`: 'bulanan'|'tahunan').
2. `PUT /api/v1/dues-types/{id}`
   - Request: `{ "amount": number (>0) }`.
   - Response 200: Updated `DuesTypeResource`. (Snapshot principle applies to future payments).

### 2.5 Payments (Pembayaran Iuran)
1. `GET /api/v1/payments`
   - Query params: `house_id`, `resident_id`, `dues_type_id`, `status` ('lunas'|'dibatalkan'), `year`, `month`, `page`, `per_page`.
   - Response 200: Paginated `PaymentResource`.
2. `POST /api/v1/payments`
   - Request: `{ house_id, dues_type_id, period_start_year, period_start_month, period_count (1-12), payment_date, notes }`.
   - Automatic breakdown into N period records. Returns 409 if house vacant or period already paid.
3. `GET /api/v1/payments/{id}`
   - Response 200: `PaymentResource` (includes breakdown `periods`: `[{ id, period_year, period_month }]`).
4. `PATCH /api/v1/payments/{id}/cancel`
   - Cancels payment (status -> 'dibatalkan'). Returns 409 if already canceled.

### 2.6 Expenses (Pengeluaran Kas)
1. `GET /api/v1/expenses`
   - Query params: `category` ('gaji_satpam'|'listrik_utilitas'|'kebersihan'|'perbaikan'|'lainnya'), `year`, `month`, `page`, `per_page`.
   - Response 200: Paginated `ExpenseResource`.
2. `POST /api/v1/expenses`
   - Request: `{ category, description, amount (>0), expense_date }`.
   - Response 201: `ExpenseResource`.
3. `GET /api/v1/expenses/{id}`
   - Response 200: `ExpenseResource`.
4. `PUT /api/v1/expenses/{id}`
   - Request: `{ category, description, amount, expense_date }`.
   - Response 200: Updated `ExpenseResource`.
5. `PATCH /api/v1/expenses/{id}/deactivate`
   - Soft deletes expense item.

### 2.7 Reports (Laporan)
1. `GET /api/v1/reports/summary`
   - Query param: `year` (int, default current year).
   - Response 200: `{ year, starting_balance, months: [{ month, income, expense, balance }] }`.
2. `GET /api/v1/reports/detail`
   - Query params: `year`, `month`.
   - Response 200: `{ year, month, payments: [...], expenses: [...], house_statuses: [{ house_id, house_number, occupancy_status, dues_statuses: [{ dues_type_id, dues_type_name, status }] }] }`.
   - Note: Dues status can be 'Lunas', 'Belum Lunas', or 'Tidak Ada Tagihan'.
3. `GET /api/v1/reports/dashboard`
   - Response 200: `{ total_houses, occupied_houses, vacant_houses, current_month_income, current_month_expense, current_balance }`.

---

## 3. Hasil Klarifikasi Penting Audit Backend vs Frontend Scope

1. **Export PDF / Excel**:
   - Backend **TIDAK MEMILIKI** endpoint export/download file PDF or Excel.
   - Sesuai instruksi master prompt Bagian 8, fitur export PDF pada Halaman Laporan (Summary & Monthly Detail) akan diimplementasikan **secara client-side** (menggunakan `@react-pdf/renderer` atau layout print CSS `@media print` / html-to-pdf conversion) tanpa membuat endpoint backend baru.
2. **User Credentials**:
   - Seeded user: `admin@resida.com` / `password`.
3. **API Client & Auth Interceptor**:
   - Token type: Bearer token (Sanctum plainTextToken).
   - Header: `Authorization: Bearer {token}`.
   - Base URL: `import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'`.

---

## 4. Kesimpulan Audit

Seluruh 31 endpoint backend API v1.0.0 telah diaudit dan diverifikasi 100%. Tidak ada discrepancy kritis yang menghalangi integrasi frontend. Frontend siap diimplementasikan sesuai 17 Halaman Arsitektur.
