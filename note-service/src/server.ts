// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from /public/uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// Import routes
import noteRoutes from './routes/notes';
import noteByIdRoutes from './routes/notes/by-id';
import byDateRoutes from './routes/notes/by-date';
import uploadRoutes from './routes/notes/upload';
import crudRoutes from './routes/notes/crud'


// Register routes
app.use('/notes', noteRoutes);
app.use('/notes', noteByIdRoutes);
app.use('/notes', byDateRoutes);
app.use('/notes', uploadRoutes);
app.use('/notes', crudRoutes)

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Note Service running at http://localhost:${PORT}`);
});
