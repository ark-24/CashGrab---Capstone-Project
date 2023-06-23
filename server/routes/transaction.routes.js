import express from 'express';

import { getAllTransactions, getTransactionDetail, createTransaction,deleteTransaction,updateTransaction,getRecentTransaction } from '../controllers/transaction.controller.js';

const router = express.Router();

router.route('/').get(getAllTransactions);
router.route('/recent').get(getRecentTransaction);
router.route('/:id').get(getTransactionDetail);
router.route('/').post(createTransaction);
router.route('/recent/:id').patch(updateTransaction);
router.route('/:id').delete(deleteTransaction);

export default router;