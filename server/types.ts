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
    revenue?: number;
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
