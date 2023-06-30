import express from 'express';

import {  createBillStatement, getCurrentBillStatement } from '../controllers/bill.controller.js';


const router = express.Router();

//router.route('/').get(getAllBillStatements);
router.route('/').post(createBillStatement);
router.route('/:userId').get(getCurrentBillStatement);


export default router;