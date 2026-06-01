# Quiz Management Portal - Setup Guide

## Overview
This is a full-stack Quiz Management Portal built with React, Express.js, and MongoDB. The application allows users to take quizzes, view results, and track their performance.

## Project Structure

```
taskmanager/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   ├── Question.js
│   │   └── Result.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   ├── questionController.js
│   │   └── resultController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── questionRoutes.js
│   │   └── resultRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── config/
│   │   └── db.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── CurrentQuiz.jsx
│   │   │   ├── UpcomingQuizzes.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Profile.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── package.json
```

## Features

### ✅ Authentication
- User registration with email, name, phone, and password
- Secure login with JWT tokens
- Protected routes for authenticated users
- Profile management

### ✅ Quiz Management
- View all available quizzes
- Filter quizzes by status (upcoming, ongoing, completed)
- Detailed quiz information with duration, marks, and dates

### ✅ Quiz Taking
- Real-time timer with visual countdown
- Multiple-choice questions
- Question navigation
- Progress tracking
- Auto-submit when time runs out

### ✅ Results
- Detailed performance metrics
- Percentage score and grade calculation
- Time tracking
- Answer review with correct/incorrect indicators
- Result history

### 🎨 Design
- Modern purple and blue gradient theme
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional UI/UX

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/quiz-portal
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the backend:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   REACT_APP_API_URL=http://localhost:5001
   ```

4. **Start the frontend:**
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/upcoming` - Get upcoming quizzes
- `GET /api/quizzes/current` - Get ongoing quizzes
- `GET /api/quizzes/completed` - Get completed quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes` - Create quiz (protected)
- `PUT /api/quizzes/:id` - Update quiz (protected)
- `DELETE /api/quizzes/:id` - Delete quiz (protected)

### Questions
- `GET /api/questions/quiz/:quizId` - Get questions by quiz
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create question (protected)
- `PUT /api/questions/:id` - Update question (protected)
- `DELETE /api/questions/:id` - Delete question (protected)

### Results
- `GET /api/results/user` - Get user's results (protected)
- `GET /api/results/quiz/:quizId` - Get quiz results
- `GET /api/results/:id` - Get result by ID
- `POST /api/results/submit` - Submit quiz (protected)

## Database Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  phone: String,
  university: String,
  address: String
}
```

### Quiz
```javascript
{
  title: String (required),
  description: String,
  createdBy: ObjectId (ref: User),
  questions: [ObjectId] (ref: Question),
  startDate: Date (required),
  endDate: Date (required),
  duration: Number (required, in minutes),
  totalMarks: Number (required),
  passingMarks: Number,
  status: String (upcoming, ongoing, completed),
  createdAt: Date,
  updatedAt: Date
}
```

### Question
```javascript
{
  quizId: ObjectId (ref: Quiz),
  questionText: String (required),
  questionType: String (multiple-choice, true-false, short-answer),
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  marks: Number (required),
  explanation: String,
  createdAt: Date
}
```

### Result
```javascript
{
  quizId: ObjectId (ref: Quiz),
  userId: ObjectId (ref: User),
  answers: [{
    questionId: ObjectId,
    selectedOption: String,
    isCorrect: Boolean
  }],
  obtainedMarks: Number,
  totalMarks: Number,
  percentage: Number,
  passed: Boolean,
  startedAt: Date,
  completedAt: Date,
  timeTaken: Number (in seconds),
  createdAt: Date
}
```

## Pages & Routes

| Route | Component | Protected | Purpose |
|-------|-----------|-----------|---------|
| `/login` | Login | No | User login |
| `/register` | Register | No | User registration |
| `/home` | Home | Yes | Dashboard with quiz cards |
| `/quiz/:id` | CurrentQuiz | Yes | Take a quiz |
| `/upcoming` | UpcomingQuizzes | Yes | View upcoming quizzes |
| `/results` | Results | Yes | View quiz results |
| `/profile` | Profile | Yes | View/edit profile |

## Usage Guide

### 1. Register a New Account
- Go to `/register`
- Enter full name, email, phone, and password
- Click "Create Account"

### 2. Login
- Go to `/login`
- Enter email and password
- Click "Confirm"

### 3. View Quizzes
- After login, you'll be on the Home page
- Quizzes are displayed as cards with status badges
- Filter by All, Upcoming, Ongoing, or Completed

### 4. Take a Quiz
- Click "Take Quiz" on an ongoing quiz
- Answer questions using the radio buttons
- Use navigation buttons to move between questions
- Click "Submit Quiz" when finished
- Timer will auto-submit if time runs out

### 5. View Results
- Go to `/results`
- Select a quiz from the list to view detailed results
- See percentage, grade, and answer review

### 6. Manage Profile
- Go to `/profile`
- Update name, email, university, or address
- Click "Update Profile" to save changes

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file has correct `MONGODB_URI`
- Ensure port 5001 is not in use

### Frontend won't connect to backend
- Verify backend is running on port 5001
- Check `REACT_APP_API_URL` in frontend `.env`
- Check browser console for CORS errors

### Quiz timer not working
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify quiz duration is set

### No quizzes appearing
- Ensure quizzes exist in MongoDB
- Check if quiz dates are set correctly
- Verify you're logged in

## Future Enhancements

- [ ] Admin panel for quiz creation and management
- [ ] Real-time leaderboard
- [ ] Certificate generation
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Quiz attempts history
- [ ] Advanced reporting and analytics
- [ ] Mobile app version
- [ ] Video question support
- [ ] Code submission questions

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- Bcrypt (password hashing)

### Frontend
- React 18
- React Router DOM v6
- Axios
- Tailwind CSS
- Context API

## License
This project is licensed under the ISC License.

## Support
For issues or questions, please open an issue or contact the development team.
