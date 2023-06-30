import express from 'express';

import { getAllTransactions, getTransactionDetail, createTransaction,deleteTransaction,updateTransaction,getRecentTransaction,getTransactions } from '../controllers/transaction.controller.js';

const router = express.Router();

router.route('/user/:userId').get(getTransactions);
router.route('/recent').get(getRecentTransaction);
router.route('/recent/:id').patch(updateTransaction);
router.route('/:id').delete(deleteTransaction);
router.route('/').get(getAllTransactions);
router.route('/').post(createTransaction);



export default router;