import express from 'express';

import { getItems, addItem } from '../controllers/item.controller.js';


const router = express.Router();

router.route('/').get(getItems);
router.route('/').post(addItem);


export default router;