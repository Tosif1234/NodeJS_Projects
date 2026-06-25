import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import loggerMiddleware from './middleware/loggerMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import residentRoutes from './routes/residentRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import pollRoutes from './routes/pollRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected via socket:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(loggerMiddleware());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser()); 

app.use(mongoSanitize());

app.use(hpp());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1' || process.env.NODE_ENV === 'test',
});
app.use('/api/', globalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Society Management API is running under secure parameters.',
    env: process.env.NODE_ENV,
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
