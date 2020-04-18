import csv from 'csvtojson';
import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

interface CsvTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {
    const csvData: CsvTransaction[] = await csv().fromFile(path);

    const createTransaction = new CreateTransactionService();

    const transactions = await Promise.all(
      csvData.map(async ({ title, type, value, category }) => {
        const transaction = await createTransaction.execute({
          title,
          type,
          value,
          category,
        });

        return transaction;
      }),
    );

    return transactions;
  }
}

export default ImportTransactionsService;
