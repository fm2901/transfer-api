import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import apiKeyMiddleware from './middleware/apiKey.js';
import apiRoutes from './routes/api.js';
import './cron/job.js';
import {swaggerSpec} from "./config.js";

const app = express();
app.use(express.json());

// Swagger

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(apiKeyMiddleware);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API is running on port ${PORT}`));
