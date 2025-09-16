// Vercel serverless function entry point
try {
  const app = require('../src/app');
  module.exports = app;
} catch (error) {
  console.error('Error starting app:', error);
  module.exports = (req, res) => {
    res.status(500).json({ 
      error: 'Server initialization failed', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  };
}
