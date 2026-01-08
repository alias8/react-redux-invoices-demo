import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { dbData } from './serverData.js';
import type { IData } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extend session type to include our data
declare module 'express-session' {
  interface SessionData {
    data: IData;
  }
}

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Session middleware - each user gets their own data copy
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || 'demo-app-secret-key-change-in-production',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 10, // 10 minutes
    },
  })
);

// Helper function to deep clone data
const cloneData = (data: IData): IData => {
  return JSON.parse(JSON.stringify(data));
};

// Initialize session data from dbData for each new session
app.use('/api', (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session.data) {
    req.session.data = cloneData(dbData);
    console.log('✓ Initialized new session with fresh data copy');
  }
  next();
});

// Middleware to add realistic random delay to API requests
app.use('/api', (_req: Request, _res: Response, next: NextFunction) => {
  // Random delay between 100ms and 800ms
  const delay = Math.floor(Math.random() * 700) + 100;
  setTimeout(() => next(), delay);
});

// API routes
app.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const users = req.session.data!.users || [];
  const user = users.find((u) => u.username === username);

  if (!user) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  // Verify password using bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    res.json({ id: user.id, username: user.username });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

app.get('/api/accounts', (req: Request, res: Response) => {
  // Calculate revenue for each account
  const accountsWithRevenue = req.session.data!.accounts.map((account) => {
    // Get all customers for this account
    const accountCustomers = req.session.data!.customers.filter((customer) =>
      account.customerIDs.includes(customer.id)
    );

    // Get all invoice IDs for all customers in this account
    const allInvoiceIDs = accountCustomers.flatMap(
      (customer) => customer.invoiceIDs
    );

    // Filter invoices for all customers in this account
    const accountInvoices = req.session.data!.invoices.filter((invoice) =>
      allInvoiceIDs.includes(invoice.id)
    );

    // Calculate total revenue
    const revenue = accountInvoices.reduce(
      (sum, invoice) => sum + invoice.purchasedPrice,
      0
    );

    return {
      ...account,
      revenue,
    };
  });

  res.json(accountsWithRevenue || {});
});

app.put('/api/accounts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const account = req.session.data!.accounts.find((a) => a.id === id);

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

  const accountIndex = req.session.data!.accounts.findIndex((a) => a.id === id);

  if (accountIndex === -1) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }

  req.session.data!.accounts.splice(accountIndex, 1);
  res.json({ success: true });
});

app.get('/api/customers', (req: Request, res: Response) => {
  // Calculate sales for each customer
  const customersWithSales = req.session.data!.customers.map((customer) => {
    // Get all invoices for this customer
    const customerInvoices = req.session.data!.invoices.filter((invoice) =>
      customer.invoiceIDs.includes(invoice.id)
    );

    // Calculate total sales
    const sales = customerInvoices.reduce(
      (sum, invoice) => sum + invoice.purchasedPrice,
      0
    );

    return {
      ...customer,
      sales,
    };
  });

  res.json(customersWithSales || []);
});

app.get('/api/invoices', (req: Request, res: Response) => {
  res.json(req.session.data!.invoices || []);
});

app.get('/api/invoices/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const invoice = req.session.data!.invoices.find((i) => i.id === id);

  if (!invoice) {
    res.status(404).json({ error: 'Invoice not found' });
    return;
  }

  res.json(invoice);
});

app.put('/api/customers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const customer = req.session.data!.customers.find((c) => c.id === id);

  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }

  customer.name = name;
  res.json(customer);
});

app.delete('/api/customers/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const customerIndex = req.session.data!.customers.findIndex(
    (c) => c.id === id
  );

  if (customerIndex === -1) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }

  req.session.data!.customers.splice(customerIndex, 1);
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
