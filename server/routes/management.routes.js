import express from 'express';

import { getEmployees, addEmployee } from '../controllers/employee.controller.js';
import { getItems, addItem } from '../controllers/item.controller.js';


const router = express.Router();

router.route('/').get(getEmployees);
router.route('/').post(addEmployee);

router.route('/items').get(getItems);
router.route('/items').post(addItem);

export default router;
