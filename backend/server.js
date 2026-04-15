const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const taskRoutes = require('./src/routes/tasks');
const errorHandler = require('./src/utils/errorHandler');
const swaggerSpec = require('./src/docs/swagger');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task API is running',
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.use((_req, _res, next) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
