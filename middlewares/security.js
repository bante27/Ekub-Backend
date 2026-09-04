const cors = require('cors');

const applySecurity = (app) => {
  const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5175'
  ];

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
};

// ✅ Export it as an object property so server.js can destructure it
module.exports = { applySecurity };