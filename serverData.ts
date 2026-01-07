import {v4 as uuid} from "uuid";
import _ from "lodash";

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

const generateMockData = () => {
    const numberOfAccounts = 5;
    const numberOfCustomers = numberOfAccounts * 5;
    const numberOfInvoices = numberOfCustomers * 10;

    const users: IUser[] = _.range(0, 2).map((_user, index: number) => {
        return {
            id: uuid(),
            username: `user${index}`,
            password: `user${index}`
        };
    });

    const invoices: IInvoice[] = _.range(0, numberOfInvoices).map(
        (_invoice, index: number) => {
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
        (_customer, index: number) => {
            const start = invoicesPerCustomer * index;
            const end = start + invoicesPerCustomer;
            return {
                id: uuid(),
                name: `customer${index}`,
                createdDate: new Date(),
                invoiceIDs: invoices.slice(start, end).map((invoice: IInvoice) => invoice.id)
            };
        }
    );

    const customersPerAccount = numberOfCustomers / numberOfAccounts;
    const accounts: IAccount[] = _.range(0, numberOfAccounts).map(
        (_account, index: number) => {
            const start = customersPerAccount * index;
            const end = start + customersPerAccount;
            return {
                id: uuid(),
                name: `account${index}`,
                description: `description ${Math.random()}`,
                customerIDs: customers.slice(start, end).map((customer: ICustomer) => customer.id),
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

export const dbData: IData = generateMockData();
