import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

interface Profile {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  level: string;
}

interface DatabaseData {
  profile?: Profile;
  skills?: Skill[];
  experience?: Experience[];
  education?: Education[];
}

// Load data from db.json
const dbPath = path.join(__dirname, 'db.json');
let dbData: DatabaseData = {};
try {
  const dbContent = fs.readFileSync(dbPath, 'utf8');
  dbData = JSON.parse(dbContent);
} catch (error) {
  console.error('Error loading db.json:', error);
}

// API routes
app.get('/api/profile', (_req: Request, res: Response) => {
  res.json(dbData.profile || {});
});

app.get('/api/skills', (_req: Request, res: Response) => {
  res.json(dbData.skills || []);
});

app.get('/api/experience', (_req: Request, res: Response) => {
  res.json(dbData.experience || []);
});

app.get('/api/education', (_req: Request, res: Response) => {
  res.json(dbData.education || []);
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to the app (but only for non-API routes)
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});