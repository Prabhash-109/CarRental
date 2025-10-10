# 🚗 GoDrive — Car Rental Application
**GoDrive** is a full-stack web application built with **Spring Boot** (backend) and **React.js** (frontend).  
It allows users to rent cars, manage bookings, and explore vehicle options online, while providing admins with tools to manage cars, users, and reservations.

---

## 🧩 Tech Stack

### **Frontend**
- ⚛️ React.js (Functional Components + Hooks)
- React Router DOM (Routing)
- Redux Toolkit (State Management)
- Axios (API Communication)
- CSS3 (Responsive UI)

### **Backend**
- ☕ Spring Boot (RESTful API)
- Spring Security + JWT Authentication
- Spring Data JPA + Hibernate
- MySQL Database
- Maven (Build Tool)

---

## 🏗️ Project Structure
GoDrive/ (CarRental workspace)
│
├── backend/
│ ├── booking-service/
│ │ ├── .github/
│ │ │ └── java-upgrade/
│ │ ├── pom.xml
│ │ ├── src/
│ │ │ ├── main/
│ │ │ │ ├── java/
│ │ │ │ │ └── com/
│ │ │ │ │ └── carrental/
│ │ │ │ │ └── bookingservice/
│ │ │ │ │ ├── BookingServiceApplication.java
│ │ │ │ │ ├── config/ # RestTemplateConfig, SecurityConfig, etc.
│ │ │ │ │ ├── controller/ # BookingController, AuthController
│ │ │ │ │ ├── dto/ # BookingRequest/Response, CarDto, Auth DTOs
│ │ │ │ │ ├── entity/ # Booking, User, BookingStatus
│ │ │ │ │ ├── repository/ # BookingRepository, UserRepository
│ │ │ │ │ ├── security/ # JwtAuthenticationFilter, security utils
│ │ │ │ │ ├── service/ # BookingService, AuthService, CarService, UserService
│ │ │ │ │ └── util/ # JwtUtil, helpers
│ │ │ │ └── resources/
│ │ │ │ └── application.yml
│ │ │ └── target/ # compiled classes, jar
│ │ └── target/
│ ├── car-service/
│ │ ├── pom.xml
│ │ ├── src/
│ │ │ ├── main/
│ │ │ │ ├── java/
│ │ │ │ │ └── com/
│ │ │ │ │ └── carrental/
│ │ │ │ │ └── carservice/
│ │ │ │ │ ├── CarServiceApplication.java
│ │ │ │ │ ├── config/
│ │ │ │ │ ├── controller/ # CarController, AuthController, UsersController
│ │ │ │ │ ├── dto/ # CarRequest, CarResponse DTOs
│ │ │ │ │ ├── entity/ # Car, User
│ │ │ │ │ ├── repository/ # CarRepository, UserRepository
│ │ │ │ │ ├── security/ # Jwt filter, SecurityConfig
│ │ │ │ │ └── service/ # CarService, AuthService
│ │ │ │ └── resources/
│ │ │ │ └── application.yml
│ │ │ └── target/
│ │ └── target/
│ └── README or additional backend-level files (if any)
│
├── frontend/
│ ├── package.json
│ ├── public/
│ │ ├── index.html
│ │ └── manifest.json
│ ├── build/ # production build artifacts
│ │ ├── index.html
│ │ ├── asset-manifest.json
│ │ └── static/
│ ├── src/
│ │ ├── index.js
│ │ ├── App.js
│ │ ├── index.css
│ │ ├── App.css
│ │ ├── components/
│ │ │ └── Navbar.js
│ │ │ └── Navbar.css
│ │ ├── contexts/
│ │ │ └── AuthContext.js
│ │ ├── pages/
│ │ │ ├── Home.js
│ │ │ ├── CarList.js
│ │ │ ├── CarDetails.js
│ │ │ ├── AddCar.js
│ │ │ ├── EditCar.js
│ │ │ ├── AgentDashboard.js
│ │ │ ├── AgentRented.js
│ │ │ ├── Login.js
│ │ │ ├── Register.js
│ │ │ ├── MyBookings.js
│ │ │ └── styles (.css) for each page
│ │ └── assets/static/ (if any images used in source)
│ └── public/ # (already above)
│
└── README.md

---

## 🚀 Features

### **User Features**
✅ Register and Login using JWT Authentication  
✅ Search cars by model, brand, or type  
✅ Book available cars for a selected date range  
✅ View booking history and active rentals  
✅ Update profile information  

### **Admin Features**
🔑 Admin Dashboard to manage cars and users  
🧾 View and approve/reject booking requests  
🚘 Add, update, or remove cars  
📊 View all bookings and statistics  

---

## ⚙️ Installation & Setup

### **Backend Setup (Spring Boot)**
cd backend
1. Configure your MySQL database in src/main/resources/application.properties
2. mvn clean install
   mvn spring-boot:run

Backend runs by default on → http://localhost:8080

### **Frontend Setup (React)**
cd frontend
npm install
npm start
Frontend runs by default on → http://localhost:3000

### **🔗 API Endpoints (Sample)**
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Authenticate and get JWT token
GET	/api/cars	Fetch all available cars
POST	/api/bookings	Create new booking
GET	/api/bookings/user/{id}	View user’s bookings
GET	/api/admin/bookings	View all bookings (Admin only)

### **🔒 Security**

JWT (JSON Web Token) based authentication and authorization
Role-based access: USER and ADMIN
Spring Security filter chain for request validation


👨‍💻 Author

Prabhash Jha
🎓 Computer Science Engineering Student
📧 Email: prabhashjha92560@gmail.com
💼 GitHub: https://github.com/Prabhash-109