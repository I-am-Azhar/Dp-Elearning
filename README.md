# DigitalPa E-Learning Platform

A modern e-learning platform built with React, Node.js, and MongoDB Atlas. Features include user authentication, course management, Google OAuth, and payment integration.

## 🚀 Features

- **User Authentication**: Email/password and Google OAuth
- **Course Management**: Browse, purchase, and track courses
- **User Profiles**: View purchased courses and account information
- **Payment Integration**: Stripe payment processing
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Updates**: Live course progress tracking

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Firebase (Authentication)
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Stripe (Payments)
- Firebase Admin SDK

## 📁 Project Structure

```
Elearn/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── config/
│   └── public/
├── server/            # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
└── .env               # Environment variables
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Firebase project
- Stripe account (optional)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Elearn
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Configuration

#### Backend (.env in root directory)
Copy `env.example` to `.env` and configure:

```env
# Required
MONGO_URI=mongodb......
JWT_SECRET=your_super_secret_jwt_key_here

# Optional (for full functionality)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
FRONTEND_URL=http://localhost:5173
PORT=5000
```

#### Frontend (.env in frontend directory)
Copy `frontend/env.example` to `frontend/.env` and configure:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start Development Servers

#### Backend
```bash
cd server
npm start
# or
node app.js
```

#### Frontend
```bash
cd frontend
npm run dev
```

## 🔐 Security Notes

⚠️ **IMPORTANT**: Never commit `.env` files to version control. They contain sensitive information like API keys and database credentials.

- All `.env` files are already in `.gitignore`
- Use `env.example` files as templates
- Generate new JWT secrets for production
- Use environment-specific Firebase projects

## 🚀 Deployment

### Backend (Heroku/Vercel/Railway)
1. Set environment variables in your hosting platform
2. Deploy the `server/` directory
3. Ensure MongoDB Atlas network access includes your hosting IP

### Frontend (Vercel/Netlify)
1. Set environment variables in your hosting platform
2. Deploy the `frontend/` directory
3. Update `FRONTEND_URL` in backend environment

## 📊 Database Schema

### Users
- name, email, password, googleId, photoURL
- role (user/admin), purchasedCourses
- timestamps

### Courses
- title, description, price, thumbnail
- originalPrice, discountedPrice, discount
- features, videoLinks, type, language
- timestamps

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (admin)

### Payments
- `POST /api/payments/initiate` - Start payment
- `POST /api/payments/webhook` - Stripe webhook

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include environment details and error logs
