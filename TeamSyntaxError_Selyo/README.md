# Selyo – Registrar Command Center & Digital Request Relay

A modern web-based system for university registrar that replaces manual, face-to-face processing with an asynchronous digital workflow.

## Team Members
- Gerald J. Llorente  
- Nil Xandrea O. Montejo  
- Jhun Lloyd M. Boyles  
- Rhoydel Jr. M. Elan  
- Krylle Love T. Ladera

## Features

- **Student Portal**: Submit and track academic requests
- **Admin Dashboard**: Manage, approve/reject requests
- **QR Code System**: Secure document pickup verification
- **Real-time Status**: Track request progress live

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   cd d:\AntiGravity\RegiSystem
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment**
   
   Edit `server/.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/selyo
   JWT_SECRET=your-secret-key
   ```

4. **Start the servers**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Default Credentials

**Admin Account** (auto-created):
- Email: `admin@selyo.edu`
- Password: `admin123`

## Project Structure

```
RegiSystem/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin pages
│   │   │   └── student/    # Student pages
│   │   └── services/       # API service
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Database config
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── uploads/            # Uploaded files
│   └── package.json
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Student Requests
- `POST /api/requests` - Create request
- `GET /api/requests` - Get user's requests
- `GET /api/requests/:id` - Get single request

### Admin
- `GET /api/admin/requests` - Get all requests
- `PUT /api/admin/requests/:id` - Update request status
- `GET /api/admin/verify/:qrCode` - Verify QR code
- `PUT /api/admin/release/:id` - Mark as released

## Screenshots / Demo Link

## License

MIT
