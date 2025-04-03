### **🛍️ Jewellery Product Management System**  

This is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) project for managing jewellery products, including authentication, CRUD operations, and optional features like pagination and search.

---

## **Features**  

✅ User Authentication (JWT) – Login, Signup  
✅ Jewellery Product Management (CRUD)  
✅ Image Upload (Multer)  
✅ Category Selection with Autocomplete  
✅ Server-Side Pagination, Search & Sorting  
✅ Proper Form Validation (react-hook-form)   

---

## **🛠️ Tech Stack**  

**Frontend:** React.js (Vite), Redux, Tailwind CSS  
**Backend:** Node.js, Express.js (MVC Pattern)  
**Database:** MongoDB (Mongoose)  
**Authentication:** JWT (JSON Web Tokens)  
**File Upload:** Multer  

---

## **📂 Project Structure**  

```
Machine-Task/
│── backend/              # Express.js API
│   ├── config/           # Database & JWT Config
│   ├── controllers/      # Business Logic
│   ├── middleware/       # Auth Middleware
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # Express Routes
│   ├── uploads/         # Image Uploads
│   ├── .env             # Environment Variables (Ignored)
│   ├── server.js        # Entry Point
│   └── package.json
│
│── frontend/             # React.js Frontend
│   ├── src/
│   │   ├── components/   # Reusable Components
│   │   ├── pages/        # Pages (Login, Dashboard, etc.)
│   │   ├── redux/        # Redux State Management
│   │   ├── assets/       # Static Files
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── README.md
│
└── README.md
```

---

## **🛠️ Setup Instructions**  

### **📌 Prerequisites**  
Ensure you have the following installed:  
- **Node.js** (`>= 18.x.x`)  
- **MongoDB** (Local or Cloud - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))  
- **Git**  

---

### **🖥️ Backend Setup**  

1️⃣ **Navigate to the backend directory:**  
```sh
cd backend
```

2️⃣ **Install dependencies:**  
```sh
npm install
```

3️⃣ **Create a `.env` file** and add the following:  
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4️⃣ **Start the backend server:**  
```sh
npm run dev
```
Server will run on **`http://localhost:5000`** 🚀  

---

### **💻 Frontend Setup**  

1️⃣ **Navigate to the frontend directory:**  
```sh
cd frontend
```

2️⃣ **Install dependencies:**  
```sh
npm install
```

3️⃣ **Start the frontend server:**  
```sh
npm run dev
```
Frontend will run on **`http://localhost:5173`**  

---

## **📌 API Endpoints**  

| Method | Endpoint            | Description           | Auth Required |
|--------|---------------------|-----------------------|--------------|
| POST   | `/api/auth/signup`  | Register a new user  | ❌           |
| POST   | `/api/auth/login`   | User login           | ❌           |
| GET    | `/api/products`     | Get all products     | ✅           |
| POST   | `/api/products`     | Create a product     | ✅           |
| PUT    | `/api/products/:id` | Update a product     | ✅           |
| DELETE | `/api/products/:id` | Delete a product     | ✅           |

✅ **Auth Required** – JWT token must be sent in `Authorization: Bearer <token>`  

---

## **🤝 Contributing**  
If you’d like to contribute:  
1️⃣ Fork the repo  
2️⃣ Create a feature branch (`git checkout -b feature-name`)  
3️⃣ Commit changes (`git commit -m "Added feature"`)  
4️⃣ Push (`git push origin feature-name`)  
5️⃣ Open a pull request  

---

## **📃 License**  
This project is **MIT Licensed**. Feel free to use and modify it.  

---
