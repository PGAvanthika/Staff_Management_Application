const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { addStatusColumn } = require('./features/due/due.migration');

const app = express();

// CORS configuration
// In production, allow requests from any origin (nginx will handle routing)
// In development, allow localhost:3000
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow all origins in production (nginx handles security)
    : 'http://localhost:3000',
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies from request

// Run migrations
addStatusColumn().catch(() => {});

// Routes
const authRoutes = require('./features/auth/auth.routes');
const userRoutes = require('./features/user/user.routes');
const projectRoutes = require('./features/project/project.routes');
const taskRoutes = require('./features/task/task.routes');
const reviewRoutes = require('./features/review/review.routes');
const logRoutes = require('./features/log/log.routes');
const dueRoutes = require('./features/due/due.routes');
const listsRoutes = require('./features/lists/lists.routes');
const notesRoutes = require('./features/notes/notes.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/dues', dueRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/notes', notesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
// Listen on 0.0.0.0 to accept connections from Docker network
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
