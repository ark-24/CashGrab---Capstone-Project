import express from 'express';

import { getEmployees, addEmployee, deleteEmployee } from '../controllers/employee.controller.js';


const router = express.Router();

router.route('/').get(getEmployees);
router.route('/').post(addEmployee);
router.route('/:id').delete(deleteEmployee);


export default router;