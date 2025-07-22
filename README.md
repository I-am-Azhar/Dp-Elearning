 # Elearn Backend (MERN, Firebase Auth, Stripe, Cloudinary)

This is a secure backend for a learning platform built with Node.js, Express, MongoDB, Firebase Auth, Stripe, and Cloudinary.

## 📦 Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- Stripe account (for payments)
- Firebase project (for authentication)
- Cloudinary account (for video hosting)

## 🚀 Getting Started

### 1. **Clone the repository**
```
git clone <your-repo-url>
cd Elearn
```

### 2. **Install dependencies**
Run this in the project root (where `package.json` is):
```
npm install
```
This will create a `node_modules` folder in the root, which is correct.

### 3. **Configure environment variables**
- Go to the `server` folder.
- Copy `.env.example` to `.env`:
  ```
  cp server/.env.example server/.env
  ```
- Open `server/.env` and fill in your credentials:
  - MongoDB URI
  - Firebase credentials
  - Stripe keys
  - Cloudinary keys
  - Allowed frontend origins

### 4. **Start MongoDB**
- If using local MongoDB, make sure it is running.

### 5. **Run the backend server**
```
npm run start
# or for auto-reload during development:
npm run dev
```
- The server entry point is `server/app.js`.
- By default, the API runs on `http://localhost:5000`.

## 🔑 Authentication
- All protected endpoints require an `Authorization: Bearer <Firebase_ID_Token>` header.
- Admin-only endpoints require the user to have `role: 'admin'` in MongoDB.

## 📚 API Endpoints

### Auth
| Method | Endpoint              | Access      | Description                       |
|--------|-----------------------|-------------|-----------------------------------|
| GET    | `/api/auth/me`        | Protected   | Get current user info             |
| GET    | `/api/auth/admin`     | Admin only  | Test admin access                 |

### Courses
| Method | Endpoint              | Access      | Description                       |
|--------|-----------------------|-------------|-----------------------------------|
| GET    | `/api/courses/`       | Public      | List all courses                  |
| GET    | `/api/courses/:id`    | Protected   | Get course details (if purchased) |
| POST   | `/api/courses/`       | Admin only  | Create a new course               |
| PUT    | `/api/courses/:id`    | Admin only  | Update a course                   |
| DELETE | `/api/courses/:id`    | Admin only  | Delete a course                   |

### Payments
| Method | Endpoint                      | Access      | Description                                 |
|--------|-------------------------------|-------------|---------------------------------------------|
| POST   | `/api/payments/initiate`      | Protected   | Initiate Stripe Checkout for a course       |
| POST   | `/api/payments/webhook`       | Public      | Stripe webhook for payment confirmation     |

### Videos
| Method | Endpoint                  | Access      | Description                                 |
|--------|---------------------------|-------------|---------------------------------------------|
| POST   | `/api/videos/get-url`     | Protected   | Get signed video URL (if purchased)         |

## 🛠️ Tips
- Never commit your `.env` file to GitHub.
- For Stripe webhooks, use the Stripe CLI or dashboard to forward events to your local server.
- For Cloudinary, store only the public ID of videos in the course model.
- For Firebase, use a service account for backend verification.

## ❓ Need Help?
If you get stuck, search for errors in your terminal or ask for help!
