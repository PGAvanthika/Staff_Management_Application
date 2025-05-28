const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRoute = require('./routes/authRoutes');
const adminRoute = require('./routes/adminRoute');
const userRoutes = require('./routes/user');
const sql = require('./config/db'); // Keep DB init here for early errors

dotenv.config();

const app = express();
const PORT = process.env.PORT

// Middleware
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true               
}));

app.use(helmet()); 
app.use(morgan("dev"));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/user', userRoutes);

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
