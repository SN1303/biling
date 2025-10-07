# ISP Billing Management System - Backend

Sistem manajemen pelanggan dan billing untuk Internet Service Provider (ISP).

## Teknologi

- PHP 8.1+
- Laravel 10.x
- MySQL/MariaDB
- Laravel Sanctum untuk autentikasi

## Requirements

- PHP >= 8.1
- Composer
- MySQL/MariaDB
- Extension PHP: BCMath, Ctype, JSON, Mbstring, OpenSSL, PDO, XML, Tokenizer

## Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd biling/backend
```

2. Install dependencies
```bash
composer install
```

3. Setup environment
```bash
cp .env.example .env
php artisan key:generate
```

4. Konfigurasi database di `.env`
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=isp_billing
DB_USERNAME=root
DB_PASSWORD=
```

5. Jalankan migrasi
```bash
php artisan migrate
```

6. (Opsional) Jalankan seeder untuk data awal
```bash
php artisan db:seed
```

## API Documentation

### Authentication

#### Login
- **URL**: `/api/login`
- **Method**: `POST`
- **Data**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password",
    "device_name": "browser"
  }
  ```
- **Response**: Token dan data user

#### Logout
- **URL**: `/api/logout`
- **Method**: `POST`
- **Header**: `Authorization: Bearer <token>`

### Customers

#### List Customers
- **URL**: `/api/customers`
- **Method**: `GET`
- **Header**: `Authorization: Bearer <token>`

#### Create Customer
- **URL**: `/api/customers`
- **Method**: `POST`
- **Header**: `Authorization: Bearer <token>`
- **Data**:
  ```json
  {
    "name": "Customer Name",
    "address": "Customer Address",
    "phone_number": "08123456789",
    "package_id": 1,
    "subscription_status": "active",
    "pppoe_username": "user123",
    "pppoe_password": "pass123"
  }
  ```

#### Update Customer
- **URL**: `/api/customers/{id}`
- **Method**: `PUT`
- **Header**: `Authorization: Bearer <token>`
- **Data**: sama seperti Create

### Payments

#### List Payments
- **URL**: `/api/payments`
- **Method**: `GET`
- **Header**: `Authorization: Bearer <token>`

#### Create Payment
- **URL**: `/api/payments`
- **Method**: `POST`
- **Header**: `Authorization: Bearer <token>`
- **Data**:
  ```json
  {
    "customer_id": 1,
    "amount": 150000,
    "payment_date": "2025-10-07",
    "period_start": "2025-10-01",
    "period_end": "2025-10-31",
    "status": "paid",
    "notes": "Monthly payment"
  }
  ```

### Packages (Admin Only)

#### List Packages
- **URL**: `/api/packages`
- **Method**: `GET`
- **Header**: `Authorization: Bearer <token>`

#### Create Package
- **URL**: `/api/packages`
- **Method**: `POST`
- **Header**: `Authorization: Bearer <token>`
- **Data**:
  ```json
  {
    "name": "Basic Plan",
    "price": 150000,
    "speed": "10 Mbps",
    "description": "Basic internet package"
  }
  ```

## Deployment ke aapanel

1. Upload kode ke server menggunakan Git atau FTP

2. Di aapanel:
   - Buat database MySQL baru
   - Buat domain/subdomain
   - Setup PHP version ke 8.1+
   - Setup directory root ke `/public`

3. Di server:
```bash
cd /www/wwwroot/your-domain
composer install --no-dev
cp .env.example .env
php artisan key:generate
```

4. Edit `.env`:
```
APP_ENV=production
APP_DEBUG=false
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_pass
```

5. Setup permissions:
```bash
chmod -R 755 storage bootstrap/cache
chown -R www:www storage bootstrap/cache
```

6. Jalankan migrasi:
```bash
php artisan migrate --force
```

## Security
- Semua route API dilindungi dengan Laravel Sanctum
- Role-based access control (Admin/Teknisi)
- Password di-hash menggunakan bcrypt
- CORS protection
- Rate limiting pada login attempts
