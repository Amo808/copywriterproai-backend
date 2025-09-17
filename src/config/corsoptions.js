const { cors } = require('./config');

/**
 * Function to dynamically configure CORS options based on the request origin.
 * This function checks if the request's origin is in the whitelist, and sets
 * the appropriate CORS options.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Function} callback - A callback function to set the CORS options.
 */
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  // Extract the origin header from the request
  const { origin } = req.headers;

  console.log('CORS check:', { origin, whitelist: cors.whitelist });

  // Check if the origin is in the whitelist or if whitelist includes '*'
  if (cors.whitelist.includes('*') || cors.whitelist.includes(origin)) {
    // If the origin is whitelisted, allow the request
    corsOptions = { 
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    };
  } else {
    // If the origin is not whitelisted, still allow for development
    corsOptions = { 
      origin: process.env.NODE_ENV === 'production' ? false : true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    };
  }

  // Pass the CORS options to the callback
  callback(null, corsOptions);
};

module.exports = corsOptionsDelegate;
