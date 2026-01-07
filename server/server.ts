import express, {Request, Response} from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {dbData} from "./serverData.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.get('/api/users', (req: Request, res: Response) => {
    const { username, password } = req.query;
    const users = dbData.users || [];
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        res.json([user]);
    } else {
        res.json([]);
    }
});

app.get('/api/accounts', (_req: Request, res: Response) => {
    res.json(dbData.accounts || {});
});

app.get('/api/customers', (_req: Request, res: Response) => {
    res.json(dbData.customers || []);
});

app.get('/api/invoices', (_req: Request, res: Response) => {
    res.json(dbData.invoices || []);
});

app.get('/api/invoices/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const invoice = dbData.invoices.find(i => i.id === id);

    if (!invoice) {
        res.status(404).json({ error: 'Invoice not found' });
        return;
    }

    res.json(invoice);
});

app.put('/api/customers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    const customer = dbData.customers.find(c => c.id === id);

    if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
    }

    customer.name = name;
    res.json(customer);
});

app.delete('/api/customers/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    const customerIndex = dbData.customers.findIndex(c => c.id === id);

    if (customerIndex === -1) {
        res.status(404).json({ error: 'Customer not found' });
        return;
    }

    dbData.customers.splice(customerIndex, 1);
    res.json({ success: true });
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