import express from 'express';
import cors from 'cors';
import testPrepRoutes from './routes/testPrep';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Autorisez explicitement le frontend
  methods: ['GET', 'POST', 'OPTIONS'], // Ajoutez OPTIONS pour les preflight
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/testprep', testPrepRoutes);

app.listen(PORT, () => {
  console.log(`✅ API Server running on port ${PORT}`);
});