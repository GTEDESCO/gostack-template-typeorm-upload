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

    const transactionsIncome = await Promise.all(
      csvData
        .filter(({ type }) => type === 'income')
        .map(async ({ title, type, value, category }) => {
          const transaction = await createTransaction.execute({
            title,
            type,
            value,
            category,
          });

          return transaction;
        }),
    );

    const transactionsOutcome = await Promise.all(
      csvData
        .filter(({ type }) => type === 'outcome')
        .map(async ({ title, type, value, category }) => {
          const transaction = await createTransaction.execute({
            title,
            type,
            value,
            category,
          });

          return transaction;
        }),
    );

    const transactions = [...transactionsIncome, ...transactionsOutcome];

    return transactions;
  }
}

export default ImportTransactionsService;
