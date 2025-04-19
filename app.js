// Load environment variables from config.env
require('dotenv').config({ path: './config.env' });

/* ─────────────────────────────────────────────────────── */
/* 📦 Core & Third-party Packages */
/* ─────────────────────────────────────────────────────── */
const express = require('express'); // Express framework
const morgan = require('morgan'); // HTTP request logger middleware
const cookieParser = require('cookie-parser'); // Cookie parser middleware

/* ─────────────────────────────────────────────────────── */
/* 🛠️  Custom Modules */
/* ─────────────────────────────────────────────────────── */
const connectDB = require('./db/server.js'); // Database connection
const authRouter = require('./routes/authRouter.js'); // Auth routes
const userRouter = require('./routes/userRouter.js'); // User routes

/* ─────────────────────────────────────────────────────── */
/* 🧱 Custom Middleware */
/* ─────────────────────────────────────────────────────── */
const errorHandlerMiddleware = require('./middleware/error-handler.js'); // Global error handler
const notFoundMiddleware = require('./middleware/not-found.js'); // Handle 404 - Not Found

/* ─────────────────────────────────────────────────────── */
/* 🚀 App Initialization */
/* ─────────────────────────────────────────────────────── */
const app = express(); // Initialize express app
const port = process.env.PORT || 5000; // Set server port

/* ─────────────────────────────────────────────────────── */
/* 🔍 Dev Logging (only in development mode) */
/* ─────────────────────────────────────────────────────── */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny')); // Morgan logging for development environment
}

/* ─────────────────────────────────────────────────────── */
/* 🧰 Global Middleware */
/* ─────────────────────────────────────────────────────── */

app.use(express.json()); // Body parser middleware (important for POST/PUT requests)

app.use(cookieParser(process.env.JWT_SECRET_KEY)); // Cookie parser middleware (to read cookies from requests)

/* ─────────────────────────────────────────────────────── */
/* 📡 Routes */
/* ─────────────────────────────────────────────────────── */

app.use('/api/v1/auth', authRouter); // Auth routes
app.use('/api/v1/users', userRouter); // user routes

/**
 * @desc    Test route for API root
 * @route   GET /api/v1/
 * @access  Public
 */
app.get('/api/v1/', (req, res) => {
  console.log(req.signedCookies); // just for testing
  res.send('📦 This is the GET route for the e-commerce project');
});

/* ─────────────────────────────────────────────────────── */
/* ⚠️ Error Handling */
/* ─────────────────────────────────────────────────────── */

app.use(notFoundMiddleware); // Handle 404 - Not Found

app.use(errorHandlerMiddleware); // Global error handler (must come after all routes/middleware)

/* ─────────────────────────────────────────────────────── */
/* 🔌 Start the Server */
/* ─────────────────────────────────────────────────────── */

const start = async () => {
  try {
    // 1) Connect to MongoDB
    await connectDB();

    // 2) Start Express server
    app.listen(port, () => {
      console.log(`Server running and listening on port ${port}...`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

start();
