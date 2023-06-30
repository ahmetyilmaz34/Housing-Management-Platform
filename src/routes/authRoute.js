import express from 'express';
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

router.route('/signup').post(
    [
        body('name').not().isEmpty().withMessage('Lütfen adınızı giriniz'),
        body('email').isEmail().withMessage('Lütfen Geçerli E-posta Girin')
            .custom((userEmail) => {
                return User.findOne({ email: userEmail }).then(user => {
                    if (user) {
                        return Promise.reject('E-posta zaten kayıtlı!')
                    }
                })
            }),
        body('password').not().isEmpty().withMessage('Lütfen bir şifre girin'),
    ], authController.createUser);

router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage);










export default router;
