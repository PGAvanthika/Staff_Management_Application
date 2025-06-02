const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRoute = require('./routes/authRoutes');
const userRoutes = require('./routes/user');
const cookieParser = require('cookie-parser');
const logRoutes=require('./routes/logRoutes')
const sql = require('./config/db'); // Keep DB init here for early errors

dotenv.config();

const app = express();
const PORT = process.env.PORT

// Middleware
app.use(express.json());
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
app.use("/api", logRoutes);

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
