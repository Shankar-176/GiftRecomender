# 🎁 Gift Recommender System

A full-stack **AI-powered Gift Recommendation Platform** that suggests personalized gifts based on user preferences.  
The project is built using **MERN Stack (MongoDB, Express.js, React, Node.js)** with JWT authentication.

---

## 🚀 Features

- 🔑 **User Authentication** – Signup, Login with JWT & Password Encryption (bcrypt).
- 🎁 **AI-Powered Gift Recommendations** – Personalized suggestions for users.
- 💬 **Chat-based Interaction** – Users can chat with the recommender system.
- 📦 **Frontend** – React with Tailwind CSS.
- ⚙️ **Backend** – Node.js, Express.js, MongoDB.
- 🔐 **Secure** – Environment variables, JWT, and private keys for data protection.

---

## 🏗️ Project Structure

```
GiftRecomender-main/
│── backend/           # Express + MongoDB backend
│   ├── models/        # Mongoose schemas (User, Recommendation, Chat)
│   ├── routes/        # API routes (users, auth, recommendations)
│   ├── db.js          # MongoDB connection
│   ├── server.js      # Express server
│   ├── package.json   # Backend dependencies
│
│── frontend/          # React frontend
│   ├── src/           # Components, pages, utils
│   ├── package.json   # Frontend dependencies
│
│── .env               # Root environment variables
│── private.key        # JWT private key
│── private.key.pub    # JWT public key
```

---

## ⚡ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/GiftRecomender.git
cd GiftRecomender-main
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the backend folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
Run the backend server:
```bash
npm start
```

### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
npm start
```

---

## 🌐 API Endpoints

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | `/api/users/signup`   | Register a new user           |
| POST   | `/api/users/login`    | Login and get JWT             |
| GET    | `/api/recommendations`| Fetch gift recommendations    |
| POST   | `/api/chat`           | Chat with the AI recommender  |

---

## 📸 Screenshots

_Add screenshots or GIFs of your app here._

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`feature-xyz`)
3. Commit changes
4. Push to your fork and open a PR

---

## 📜 License

This project is licensed under the **MIT License**.

---

💡 Developed with ❤️ using MERN Stack
