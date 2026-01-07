import express, {Request, Response} from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {dbData} from "./serverData.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;



// API routes
app.get('/api/accounts', (_req: Request, res: Response) => {
    res.json(dbData.accounts || {});
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

// Handle React routing, return all requests to the app (but only for non-API routes)
app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});