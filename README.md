# QuickServe

QuickServe is a full-stack local services marketplace built with React, Vite, Express, and MongoDB. It lets customers discover nearby services, create bookings, leave reviews, and lets providers publish service listings with image uploads.

## Features

- Browse service listings and individual service details
- Register and log in with JWT-based authentication
- Role-aware flows for `customer`, `provider`, and `admin`
- Create service listings with up to 5 uploaded images
- Book services and manage booking status
- Leave provider reviews tied to a service
- Graceful mock-data fallback for public service browsing when the API is offline

## Tech Stack

- Frontend: React 19, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, Mongoose, JWT, Multer, Cloudinary
- Database: MongoDB

## Project Structure

```text
QuickServe/
|- backend/   # Express API, MongoDB models, auth, bookings, reviews, uploads
|- frontend/  # React + Vite client app
```

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB database connection string
- Cloudinary account for image uploads

### 1. Install dependencies

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=3000
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Start the backend

```bash
cd backend
node server.js
```

For auto-reload during development:

```bash
cd backend
npx nodemon server.js
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend usually runs on `http://localhost:5173` and the backend on `http://localhost:3000`.

## Main Routes

### Frontend

- `/` home page
- `/services` service listing page
- `/services/:id` service details page
- `/login` sign-in page
- `/register` sign-up page
- `/bookings` protected bookings dashboard
- `/upload` provider/admin service upload page
- `/admin` admin-only dashboard

### Backend API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/services`
- `GET /api/services/:id`
- `POST /api/services`
- `POST /api/bookings`
- `GET /api/bookings/user`
- `GET /api/bookings/provider`
- `PUT /api/bookings/:id`
- `POST /api/reviews`
- `GET /api/reviews/provider/:id`
- `POST /api/upload`

## Notes

- Public service and review views can fall back to mock data if the backend is unreachable.
- Auth, bookings, uploads, and review creation require the backend to be running.
- Image uploads depend on valid Cloudinary credentials.
- There is currently no root-level script that starts both frontend and backend together.

## Known Limitations

- No automated test suite is configured yet.
- The backend package does not currently define `start` or `dev` scripts.
- The registration form currently exposes the `admin` role, which is convenient for demos but should be restricted before production use.

## Future Improvements

- Add root workspace scripts for running both apps together
- Add automated tests for API routes and frontend flows
- Harden role management and admin creation
- Add search, filtering, and payment integrations

