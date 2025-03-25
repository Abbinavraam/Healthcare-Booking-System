# Healthcare Booking System

## 🚀 Overview
The **Healthcare Booking System** is a full-stack web application built using the **MERN (MongoDB, Express.js, React.js, Node.js) stack**. It allows **patients** to book appointments with doctors, while **doctors** can manage their availability. The **admin** oversees the system, approving doctor registrations and managing users.

## 🌟 Features
### 🏥 Patient Features:
- Register/Login
- Browse doctors by specialization
- View doctor profiles & availability
- Book an appointment
- View and cancel booked appointments

### 👨‍⚕️ Doctor Features:
- Register/Login
- Set available time slots
- View and manage booked appointments
- Update profile

### 🔧 Admin Features:
- Approve/reject doctor registrations
- Manage all users (doctors & patients)
- View all appointments

## 🛠️ Tech Stack
### 💻 Frontend:
- React.js
- React Router (for navigation)
- Responsive & user-friendly UI

### ⚙️ Backend:
- Node.js & Express.js (RESTful APIs)
- JWT authentication
- bcrypt.js for secure password hashing

### 🗄️ Database:
- MongoDB
- Stores user details, doctor availability, and appointments

## 📂 Project Structure
```
/healthcare-booking-system
│── backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│
│── frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── App.js
│   ├── index.js
│
│── .gitignore
│── README.md
│── package.json
```

## 🔐 Authentication & Authorization
- JWT-based authentication for security
- Role-based access control:
  - **Patients** can book appointments
  - **Doctors** manage their schedules
  - **Admins** oversee the system

## 📊 Data Handling & Validation
- Validation for user inputs (e.g., email format, required fields)
- Error handling for failed requests

## 🎨 UI/UX Considerations
- Simple, clean, and mobile-friendly design
- Intuitive appointment booking flow

## 🚀 Getting Started
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/healthcare-booking-system.git
cd healthcare-booking-system
```

### 2️⃣ Install Dependencies
#### Backend:
```sh
cd backend
npm install
```
#### Frontend:
```sh
cd ../frontend
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the backend folder and set the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4️⃣ Run the Application
#### Backend:
```sh
cd backend
npm start
```
#### Frontend:
```sh
cd ../frontend
npm start
```

## 🌍 Live Demo
🔗 [Healthcare Booking System](https://healthcare-booking-system-pksv.vercel.app/)

## 🤝 Contribution
Contributions are welcome! If you have any suggestions or issues, feel free to submit a pull request or open an issue.

## 📜 License
This project is licensed under the **MIT License**.

---
💡 **Let's revolutionize healthcare accessibility with technology!** 🚀

