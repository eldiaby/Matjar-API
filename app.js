// Load environment variables from config.env
require('dotenv').config({ path: './config.env' });

const express = require('express');

// DATABASE
const connectDB = require('./db/server.js');

// Custom Middlewares
const errorHandlerMiddleware = require('./middleware/error-handler.js');
const notFoundMiddleware = require('./middleware/not-found.js');

const app = express();
const port = process.env.PORT || 5000;

// Body parser middleware (important for POST/PUT requests)
app.use(express.json());

/**
 * @desc    Test route for API root
 * @route   GET /api/v1/
 * @access  Public
 */
app.get('/api/v1/', (req, res) => {
  console.log(req.body);
  res.send('📦 This is the GET route for the e-commerce project');
});

// Handle 404 - Not Found errors
app.use(notFoundMiddleware);

// Use custom error-handling middleware (should come after all routes)
app.use(errorHandlerMiddleware);

/**
 * Start the server after successfully connecting to the database
 */
const start = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start Express server
    app.listen(port, () => {
      console.log(`Server running and listening on port ${port}...`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

start();
