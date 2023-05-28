import express from 'express';

import { getEmployees, addEmployee } from '../controllers/employee.controller.js';


const router = express.Router();

router.route('/').get(getEmployees);
router.route('/').post(addEmployee);

export default router;