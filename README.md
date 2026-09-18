# Shortlink App

A full-stack URL shortener application built from scratch with Next.js, Node.js, Express, PostgreSQL, and Prisma.

## ✨ Features

- Create short links
- Custom short-link codes
- Automatic short-link generation
- URL redirection
- Click tracking
- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Email verification
- User-specific short-link management
- Edit and delete short links
- QR code generation
- Responsive dashboard

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- JWT
- bcrypt
- Resend

### Database
- PostgreSQL
- Prisma ORM
- Neon

### Deployment
- Vercel
- GitHub

## 🏗️ Project Structure

```text
shortlink-app/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── controllers/
│       ├── lib/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── server.ts
│
├── frontend/
│   └── app/
│       ├── dashboard/
│       ├── login/
│       ├── register/
│       └── verify-email/
│
└── README.md