# 📚 Online Quiz Management Portal

A comprehensive full-stack Quiz Management System built with React, Node.js, Express, and MongoDB. This application allows users to take quizzes, track their performance, and view detailed results with real-time scoring.

## Features

### User Authentication
- Secure user registration with email, phone, and password
- JWT-based authentication
- Password hashing with bcrypt
- Profile management
- Protected routes

### Quiz Management
- Browse all quizzes with detailed information
- Filter quizzes by status (Upcoming, Ongoing, Completed)
- Real-time quiz timer with countdown
- Multiple question types
- Progress tracking during quiz

### Quiz Taking
- Clean, intuitive quiz interface
- Real-time countdown timer
- Question navigation with visual progress
- Auto-submit when time expires
- Instant scoring upon submission

### Results & Performance
- Detailed result display with percentage and grade
- Performance metrics (marks obtained, passing status)
- Time tracking (time taken vs duration)
- Answer review with correct/incorrect indicators
- Historical result tracking

### Design & UX
- Modern gradient theme (purple & blue)
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional UI with Tailwind CSS
- Accessible and intuitive navigation

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object modeling
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router DOM v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management

## Quick Start

### Prerequisites
- Node.js v14 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

**Option 1: Automated Setup (Windows)**
```bash
setup.bat
```

**Option 2: Automated Setup (Linux/Mac)**
```bash
chmod +x setup.sh
./setup.sh
```

**Option 3: Manual Setup**

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create .env file with MongoDB URI and JWT_SECRET
   npm run dev
   ```

2. **Frontend Setup (new terminal):**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Usage Guide

### 1. Create Account
- Navigate to `/register`
- Fill in your details (name, email, phone, password)
- Click "Create Account"

### 2. Login
- Go to `/login`
- Enter email and password
- Click "Confirm"

### 3. Browse Quizzes
- View all available quizzes on the home page
- Use filters to see upcoming, ongoing, or completed quizzes
- Each quiz card shows duration, marks, and dates

### 4. Take a Quiz
- Click "Take Quiz" on any ongoing quiz
- Answer questions using the radio buttons
- Watch the countdown timer
- Navigate between questions
- Submit when complete

### 5. View Results
- Go to Results page
- Select a quiz to see detailed performance
- Review your answers with correct/incorrect indicators
- Track improvement over time

## 📁 Project Structure

```
taskmanager/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   ├── Question.js
│   │   └── Result.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── SETUP_GUIDE.md
├── setup.sh
├── setup.bat
└── README.md
```

## API Endpoints

| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/profile` | Yes | Get profile |
| PUT | `/api/auth/profile` | Yes | Update profile |
| GET | `/api/quizzes` | No | Get all quizzes |
| GET | `/api/quizzes/upcoming` | No | Get upcoming quizzes |
| GET | `/api/quizzes/current` | No | Get ongoing quizzes |
| GET | `/api/quizzes/:id` | No | Get quiz by ID |
| POST | `/api/results/submit` | Yes | Submit quiz |
| GET | `/api/results/user` | Yes | Get user results |

## Design Theme

The application uses a modern gradient color scheme:
- **Primary**: Purple (#6b21a8)
- **Secondary**: Blue (#2563eb)
- **Gradient**: Purple to Blue

All components are designed with accessibility and responsiveness in mind.

## Pages

| Route | Purpose | Auth Required |
|-------|---------|--------|
| `/login` | User login | No |
| `/register` | User registration | No |
| `/home` | Dashboard/Home | Yes |
| `/quiz/:id` | Take quiz | Yes |
| `/upcoming` | View upcoming quizzes | Yes |
| `/results` | View results | Yes |
| `/profile` | Manage profile | Yes |

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes for authenticated users
- Input validation on backend
- CORS configuration
- Environment variable management

## Environment Variables

### Backend `.env`
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/quiz-portal
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5001
```

## Troubleshooting

**Backend won't start:**
- Ensure MongoDB is running
- Check `.env` file has correct MongoDB URI
- Verify port 5001 is not in use

**Frontend can't connect to backend:**
- Verify backend is running on port 5001
- Check `REACT_APP_API_URL` in frontend `.env`
- Look for CORS errors in browser console

**Quizzes not loading:**
- Ensure you're logged in
- Check if quizzes exist in MongoDB
- Verify quiz start/end dates are valid

## Database Models

### User
- name (string, required)
- email (string, required, unique)
- password (string, required, hashed)
- phone (string)
- university (string)
- address (string)

### Quiz
- title (string, required)
- description (string)
- createdBy (ObjectId, ref: User)
- questions (ObjectId[], ref: Question)
- startDate (Date)
- endDate (Date)
- duration (number, in minutes)
- totalMarks (number)
- passingMarks (number)
- status (string: upcoming/ongoing/completed)

### Question
- quizId (ObjectId, ref: Quiz)
- questionText (string, required)
- options (array of {text, isCorrect})
- marks (number)
- explanation (string)

### Result
- quizId (ObjectId, ref: Quiz)
- userId (ObjectId, ref: User)
- answers (array of {questionId, selectedOption, isCorrect})
- obtainedMarks (number)
- totalMarks (number)
- percentage (number)
- passed (boolean)
- timeTaken (number, in seconds)

## Future Enhancements

- [ ] Admin dashboard for quiz management
- [ ] Real-time leaderboard
- [ ] Certificate generation
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Advanced analytics and reporting
- [ ] Mobile app version
- [ ] Video questions support
- [ ] Code editor for programming questions
- [ ] Proctoring features

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**Built with using React, Node.js, Express, and MongoDB**
* **Git [**[https://git-scm.com/](https://git-scm.com/)]** **
* **VS code editor** [[https://code.visualstudio.com/](https://code.visualstudio.com/)]** **
* **MongoDB Account** [[https://account.mongodb.com/account/login](https://account.mongodb.com/account/login)]** - In tutorial, we have also showed how can you create account and database: follow step number 2.**
* **GitHub Account** [[https://github.com/signup?source=login](https://github.com/signup?source=login)]** **

---
