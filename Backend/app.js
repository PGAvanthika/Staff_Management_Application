const express = require('express');
const app = express(); 
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const authRoute = require('./routes/authRoutes');
const userRoutes = require('./routes/user');
const logRoutes = require('./routes/logRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes'); // ✅ include this

dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));
app.use(helmet()); 
app.use(morgan("dev"));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoutes);
app.use('/api', logRoutes);
app.use('/api/projects', projectRoutes);  // handles /api/projects
app.use('/api/tasks', taskRoutes);       // ✅ handles /api/tasks

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
