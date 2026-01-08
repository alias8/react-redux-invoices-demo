import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import type { IData, IAccount, ICustomer, IInvoice, IUser } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateMockData = () => {
  const numberOfAccounts = 5;
  const numberOfCustomers = numberOfAccounts * 5;
  const numberOfInvoices = numberOfCustomers * 10;

  const users: IUser[] = _.range(0, 2).map((_user, index: number) => {
    return {
      id: uuid(),
      username: `user${index}`,
      password: `user${index}`,
    };
  });

  const invoices: IInvoice[] = _.range(0, numberOfInvoices).map(
    (_invoice, index: number) => {
      return {
        id: uuid(),
        description: `invoice ${index}`,
        purchasedDate: new Date(),
        purchasedPrice: Math.floor(Math.random() * 100),
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
        invoiceIDs: invoices
          .slice(start, end)
          .map((invoice: IInvoice) => invoice.id),
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
        customerIDs: customers
          .slice(start, end)
          .map((customer: ICustomer) => customer.id),
        ownedBy: getRandomUserID(),
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
    customers,
  };

  return data;
};

const dbData = generateMockData();

// Write the data to db.json
const outputPath = join(__dirname, 'db.json');
writeFileSync(outputPath, JSON.stringify(dbData, null, 2), 'utf-8');

console.log('✓ Generated db.json with:');
console.log(`  - ${dbData.users.length} users`);
console.log(`  - ${dbData.accounts.length} accounts`);
console.log(`  - ${dbData.customers.length} customers`);
console.log(`  - ${dbData.invoices.length} invoices`);
