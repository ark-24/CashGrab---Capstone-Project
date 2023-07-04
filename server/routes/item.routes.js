import express from 'express';

import { getItems, addItem, deleteItem } from '../controllers/item.controller.js';


const router = express.Router();

router.route('/:userId').get(getItems);
router.route('/').post(addItem);
router.route('/:id').delete(deleteItem);



export default router;