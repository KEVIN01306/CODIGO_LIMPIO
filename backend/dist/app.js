import express from 'express';
import cors from 'cors';
import routes from './routes/index.routes.js';
import cookieParser from 'cookie-parser';
const app = express();
app.use(cors({
    origin: function (origin, callback) {
        // Permite cualquier origen dinámicamente (ideal para evitar problemas de CORS en desarrollo/testing)
        callback(null, origin || true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);
// Increase body size limits to accept base64 image payloads (adjust if needed)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(routes);
export default app;
//# sourceMappingURL=app.js.map