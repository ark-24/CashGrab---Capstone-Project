import express from 'express';

import { createUser, getUser, getUserInfoByID, registerUser,loginUser, getAllUser} from '../controllers/user.controller.js';


const router = express.Router();

router.route('/:userId').get(getUser);
router.route('/').get(getAllUser);

router.route('/').post(createUser);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/:id').get(getUserInfoByID);


export default router;