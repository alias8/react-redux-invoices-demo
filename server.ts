import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import _ from "lodash";
import { v4 as uuid } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

export type ICustomerID = string;
export type IInvoiceID = string;
export type IAccountID = string;
export type IUserID = string;

export interface IAccount {
    id: IAccountID;
    name: string;
    description: string;
    customerIDs: ICustomerID[];
    ownedBy: IUserID;
    revenue?: number; // aggregated revenue across all customers in the account
}

export interface ICustomer {
    id: ICustomerID;
    name: string;
    createdDate: Date;
    invoiceIDs: IInvoiceID[];
}

export interface IInvoice {
    id: IInvoiceID;
    description: string;
    purchasedDate: Date;
    purchasedPrice: number;
}

export interface IUser {
    id: IUserID;
    username: string;
    password: string;
}

export interface IData {
    users: IUser[];
    accounts: IAccount[];
    customers: ICustomer[];
    invoices: IInvoice[];
}

const aa = () => {
    const numberOfAccounts = 5;
    const numberOfCustomers = numberOfAccounts * 5;
    const numberOfInvoices = numberOfCustomers * 10;

    const users: IUser[] = _.range(0, 2).map((user, index) => {
    return {
        id: uuid(),
        username: `user${index}`,
        password: `user${index}`
    };
});

const invoices: IInvoice[] = _.range(0, numberOfInvoices).map(
    (invoice, index) => {
        return {
            id: uuid(),
            description: `invoice ${index}`,
            purchasedDate: new Date(),
            purchasedPrice: Math.floor(Math.random() * 100)
        };
    }
);

const invoicesPerCustomer = numberOfInvoices / numberOfCustomers;
const customers: ICustomer[] = _.range(0, numberOfCustomers).map(
    (customer, index) => {
        const start = invoicesPerCustomer * index;
        const end = start + invoicesPerCustomer;
        return {
            id: uuid(),
            name: `customer${index}`,
            createdDate: new Date(),
            invoiceIDs: invoices.slice(start, end).map(invoice => invoice.id)
        };
    }
);

const customersPerAccount = numberOfCustomers / numberOfAccounts;
const accounts: IAccount[] = _.range(0, numberOfAccounts).map(
    (account, index) => {
        const start = customersPerAccount * index;
        const end = start + customersPerAccount;
        return {
            id: uuid(),
            name: `account${index}`,
            description: `description ${Math.random()}`,
            customerIDs: customers.slice(start, end).map(customer => customer.id),
            ownedBy: getRandomUserID()
        };
    }
);

function getRandomUserID() {
    const userID = Math.round(Math.random());
    return users[userID].id;
}

const data: IData = {
    users,
    accounts,
    invoices,
    customers
};

return data;
}

let dbData: IData = {
    users:[],
    accounts:[],
    invoices:[],
    customers:[]
};
try {
  dbData = JSON.parse(aa().toString());
} catch (error) {
  console.error('Error loading db.json:', error);
}

// API routes
app.get('/api/accounts', (_req: Request, res: Response) => {
  res.json(dbData.accounts || {});
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Handle React routing, return all requests to the app (but only for non-API routes)
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});