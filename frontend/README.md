# ISP Billing Management System - Frontend

Frontend aplikasi manajemen pelanggan dan billing untuk Internet Service Provider (ISP).

## Teknologi

- React 18
- Vite
- Material-UI (MUI)
- React Query
- React Router
- Axios

## Requirements

- Node.js >= 16
- npm atau yarn

## Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd biling/frontend
```

2. Install dependencies
```bash
npm install
# atau
yarn
```

3. Setup environment
```bash
cp .env.example .env
```

4. Konfigurasi API URL di `.env`
```
VITE_API_URL=http://localhost:8000/api
```

5. Jalankan development server
```bash
npm run dev
# atau
yarn dev
```

## Fitur

### Dashboard
- Statistik pelanggan aktif
- Total pendapatan bulan ini
- Jumlah pelanggan belum bayar
- Grafik pendapatan

### Manajemen Pelanggan
- List semua pelanggan dengan filter dan pencarian
- Tambah pelanggan baru
- Edit data pelanggan
- Detail pelanggan dengan riwayat pembayaran
- Sistem catatan untuk komunikasi admin-teknisi

### Pembayaran
- Record pembayaran bulanan
- Status pembayaran (lunas/belum/parsial)
- Riwayat pembayaran per pelanggan
- Laporan pembayaran bulanan

### Paket Internet (Admin Only)
- Manajemen paket internet
- Set harga dan kecepatan
- Tracking jumlah pelanggan per paket

## Build & Deployment

### Build untuk Production

```bash
npm run build
# atau
yarn build
```

File build akan tersedia di folder `dist/`

### Deploy ke aapanel

1. Build project
```bash
npm run build
```

2. Upload isi folder `dist/` ke server:
   - Bisa menggunakan FTP
   - Atau menggunakan file manager aapanel

3. Di aapanel:
   - Setup subdomain/domain untuk frontend
   - Set document root ke folder yang berisi file build
   - Setup nginx configuration:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

4. Setup CORS di backend:
   - Tambahkan domain frontend ke allowed origins
   - Pastikan credentials diizinkan

## Development

### Struktur Folder

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── api.js         # API client configuration
  ├── theme.js       # MUI theme configuration
  ├── App.jsx        # Main app component
  └── main.jsx       # Entry point
```

### Tema

Aplikasi mendukung tema terang dan gelap yang bisa diubah user. Konfigurasi tema ada di `src/theme.js`.

### State Management

- React Query untuk state server
- React hooks untuk state lokal
- Local storage untuk autentikasi

### Security

- Token JWT disimpan di localStorage
- Axios interceptors untuk handling 401
- Role-based route protection
- Input validation

## Troubleshooting

### CORS Issues
Pastikan:
1. Backend CORS settings sudah benar
2. API URL di `.env` sudah benar
3. Credentials mode di Axios sudah sesuai

### Authentication Issues
1. Clear localStorage
2. Pastikan token belum expired
3. Cek route protection di `App.jsx`