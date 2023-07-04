import express from 'express';

import { getAllIncome, createIncomeStatement, getCurrentIncome, getIncomePerDay } from '../controllers/income.controller.js';


const router = express.Router();
router.route('/week/:userId').get(getIncomePerDay);

router.route('/:userId').get(getAllIncome);
router.route('/').post(createIncomeStatement);
router.route('/:id').get(getCurrentIncome);



export default router;