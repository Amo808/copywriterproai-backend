// Vercel serverless function entry point
try {
  console.log('Starting server initialization...');
  
  // Check critical files exist
  const fs = require('fs');
  const path = require('path');
  
  const criticalFiles = [
    '../src/config/auths.js',
    '../src/config/config.js',
    '../src/app.js'
  ];
  
  for (const file of criticalFiles) {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Critical file missing: ${file}`);
    }
  }
  
  console.log('All critical files exist, loading app...');
  const app = require('../src/app');
  console.log('App loaded successfully');
  
  module.exports = app;
} catch (error) {
  console.error('Error starting app:', error);
  console.error('Stack trace:', error.stack);
  
  module.exports = (req, res) => {
    res.status(500).json({ 
      error: 'Server initialization failed', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  };
}
