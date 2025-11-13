Here is a **fully detailed, production-grade `README.md`** you can directly copy-paste into GitHub.
It includes installation steps, project structure, API documentation, environment setup, and more — all based on the files you uploaded.

---

# 📘 **LMS Backend + AI Interviewer – Full Project Documentation**

A complete backend system for a **Learning Management System (LMS)** built using **Flask + MongoDB**, with an additional **AI Interview Question Generator** built using **LangChain + Google Gemini**.

This project supports:

* User management & Clerk authentication sync
* Course creation & enrollment
* Student progress monitoring
* Admin dashboard stats
* AI-powered Python interview question generator
* Full CORS support for modern React frontends (Vite-friendly)

---

# 🚀 **Features**

### ✅ **User Management**

* Create / List users
* Clerk authentication sync
* Admin role auto-assignment for “admin” usernames

### 🎓 **Course Management**

* Add new courses
* List & fetch course details
* Enroll / Unenroll users
* Fetch “My Courses” for each user

### 📊 **Admin Analytics**

* Total users
* Total courses
* Active & completed enrollments

### 📝 **Student Progress Logs**

* Add topic-wise progress logs
* Fetch logs by user & course

### 🤖 **AI Interview Question Generator (Gemini)**

* Generates **15 Python interview questions** (last 2 are coding questions in *one line*)
* Uses: `langchain-google-genai`

---

# 🗂 **Project Structure**

```
├── app.py                     # Main LMS backend (Flask + MongoDB)
├── Interviewer.py             # AI Interview Question API
├── requirements.txt           # Python dependencies
├── README.md                  # You are here
├── models/                    # MongoEngine models
│   ├── user.py
│   ├── course.py
│   ├── enrollment.py
│   └── progress_log.py
└── .env                       # MongoDB URI + API keys
```

---

# 🔧 **Tech Stack**

| Component  | Technology                                |
| ---------- | ----------------------------------------- |
| Backend    | Flask                                     |
| Database   | MongoDB (MongoEngine + PyMongo)           |
| AI Model   | Google Gemini (gemini-2.5-flash)          |
| ORM        | MongoEngine                               |
| CORS       | flask-cors                                |
| Deployment | Compatible with Docker / Render / Railway |

---

# 🛠 **Installation & Setup**

### 1️⃣ **Clone the Repository**

```sh
git clone https://github.com/yourname/yourrepo.git
cd yourrepo
```

### 2️⃣ **Create Virtual Environment**

```sh
python -m venv venv
source venv/bin/activate    # Linux/Mac
venv\Scripts\activate       # Windows
```

### 3️⃣ **Install Dependencies**

```sh
pip install -r requirements.txt
```

### 4️⃣ **Create `.env` File**

Create a file named `.env`:

```
MONGODB_URI=mongodb+srv://your_connection_string
GOOGLE_API_KEY=your_gemini_api_key
```

### 5️⃣ **Run the LMS Backend**

```sh
python app.py
```

### 6️⃣ **Run the Interviewer AI API**

```sh
python Interviewer.py
```

Default ports:

| Service          | Port                                    |
| ---------------- | --------------------------------------- |
| LMS Backend      | `5000`                                  |
| AI Interview API | `5000` (if run separately, change port) |

---

# 🌐 **API Documentation**

## **🧑‍💻 User APIs**

### ➤ **Create User**

```
POST /api/users
```

Body:

```json
{
  "name": "John",
  "email": "john@gmail.com",
  "clerk_id": "user_123"
}
```

### ➤ **List Users**

```
GET /api/users
```

### ➤ **Get User by Clerk ID**

```
GET /api/user/<clerk_id>
```

---

## **📚 Course APIs**

### ➤ **Create Course**

```
POST /api/courses
```

Body:

```json
{
  "title": "Python Basics",
  "price": 499,
  "tutor": "Venkatesh",
  "duration": "2 Months",
  "curriculum": "Variables, Loops, Functions"
}
```

### ➤ **List All Courses**

```
GET /api/courses
```

### ➤ **Get Course by ID**

```
GET /api/courses/<course_id>
```

---

## **🎓 Enrollment APIs**

### ➤ **Enroll User**

```
POST /api/enroll
```

```json
{
  "clerk_id": "user_123",
  "course_id": "65bc..."
}
```

### ➤ **Get My Courses**

```
GET /api/my-courses?clerk_id=user_123
```

### ➤ **Unenroll**

```
DELETE /api/enroll/<enrollment_id>
```

---

## **📊 Admin APIs**

### ➤ **Admin Stats**

```
GET /api/admin/stats
```

Returns:

```json
{
  "users": 10,
  "courses": 5,
  "enrollments": 22,
  "active_enrollments": 10,
  "completed_enrollments": 12
}
```

### ➤ **Admin Enrollment Table**

```
GET /api/admin/enrollments
```

---

## **📝 Progress Log APIs**

### ➤ **Create Log**

```
POST /api/monitor
```

### ➤ **Get Logs**

```
GET /api/monitor?clerk_id=123&course=python
```

---

# 🤖 **AI Interview Question Generator API**

### ➤ **Generate Python Questions**

```
GET /api/questions
```

Returns:

```json
[
  "What is Python?",
  "Explain OOP concepts in Python",
  "...",
  "Write a one-line program to reverse a string",
  "Write a one-line program to count vowels in a string"
]
```

---

# 🐳 **Docker Support (Optional)**

If you want, I can generate a **Dockerfile + Docker Compose** for production deployment.

Just ask:
👉 *“Generate Dockerfile and docker-compose.yml for this project”*

---

# 📄 **License**

MIT License (free for commercial + personal use)

---

# ⭐ **Contributions**

Feel free to submit PRs & issues!

---

If you'd like, I can also:

✅ Generate badges (GitHub Actions, Docker, Python version)
✅ Generate project banner image
✅ Auto-create GitHub Releases
✅ Add Swagger API docs

Just tell me!
