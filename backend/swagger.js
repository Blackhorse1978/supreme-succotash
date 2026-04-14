const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Modern Sweets Bakery CRM API',
      version: '2.0.0',
      description: 'Professional MERN Bakery Management API (Auth/Orders/Products)',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://api.modernsweets.in' : 'http://localhost:5001',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './swagger/*.yml'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
