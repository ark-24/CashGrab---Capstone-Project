import express from 'express';

import { getAllIncome, createIncomeStatement, getCurrentIncome } from '../controllers/income.controller.js';


const router = express.Router();

router.route('/').get(getAllIncome);
router.route('/').post(createIncomeStatement);
router.route('/:id').get(getCurrentIncome);


export default router;