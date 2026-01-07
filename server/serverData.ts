import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { IData } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Re-export types for consumers
export type { ICustomerID, IInvoiceID, IAccountID, IUserID, IAccount, ICustomer, IInvoice, IUser, IData } from './types.js';

// Load data from db.json
const loadData = (): IData => {
    try {
        const dbPath = join(__dirname, 'db.json');
        const fileContent = readFileSync(dbPath, 'utf-8');
        const data = JSON.parse(fileContent);
        console.log('✓ Loaded data from db.json');
        return data;
    } catch (error) {
        console.error('Error loading db.json:', error);
        console.error('Please run "npm run generate-db" to create the database file');
        throw error;
    }
};

export const dbData: IData = loadData();
