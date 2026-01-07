import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {dbData} from "./serverData.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to add realistic random delay to API requests
app.use('/api', (_req: Request, _res: Response, next: NextFunction) => {
    // Random delay between 100ms and 800ms
    const delay = Math.floor(Math.random() * 700) + 100;
    setTimeout(() => next(), delay);
});

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
    // Calculate revenue for each account
    const accountsWithRevenue = dbData.accounts.map(account => {
        // Get all customers for this account
        const accountCustomers = dbData.customers.filter(customer =>
            account.customerIDs.includes(customer.id)
        );

        // Get all invoice IDs for all customers in this account
        const allInvoiceIDs = accountCustomers.flatMap(customer => customer.invoiceIDs);

        // Filter invoices for all customers in this account
        const accountInvoices = dbData.invoices.filter(invoice =>
            allInvoiceIDs.includes(invoice.id)
        );

        // Calculate total revenue
        const revenue = accountInvoices.reduce((sum, invoice) => sum + invoice.purchasedPrice, 0);

        return {
            ...account,
            revenue
        };
    });

    res.json(accountsWithRevenue || {});
});

app.put('/api/accounts/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const account = dbData.accounts.find(a => a.id === id);

    if (!account) {
        res.status(404).json({ error: 'Account not found' });
        return;
    }

    account.name = name;
    account.description = description;
    res.json(account);
});

app.delete('/api/accounts/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    const accountIndex = dbData.accounts.findIndex(a => a.id === id);

    if (accountIndex === -1) {
        res.status(404).json({ error: 'Account not found' });
        return;
    }

    dbData.accounts.splice(accountIndex, 1);
    res.json({ success: true });
});

app.get('/api/customers', (_req: Request, res: Response) => {
    // Calculate sales for each customer
    const customersWithSales = dbData.customers.map(customer => {
        // Get all invoices for this customer
        const customerInvoices = dbData.invoices.filter(invoice =>
            customer.invoiceIDs.includes(invoice.id)
        );

        // Calculate total sales
        const sales = customerInvoices.reduce((sum, invoice) => sum + invoice.purchasedPrice, 0);

        return {
            ...customer,
            sales
        };
    });

    res.json(customersWithSales || []);
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