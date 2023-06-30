import express from "express";
import * as pageController from "../controllers/pageController.js";
import * as mailController from "../controllers/mailController.js";
import redirectMiddleware from '../middlewares/redirectMiddleware.js';
const router = express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/duyuru").get(pageController.getDuyuruPage);
router.route("/contact").get(pageController.getContactPage);
router.route('/contact').post(mailController.sendMail);
router.route('/register').get(redirectMiddleware, pageController.getRegisterPage);
router.route('/login').get(redirectMiddleware, pageController.getLoginPage);
router.route('/aidat').get( pageController.getKiraciAidatPage);

export default router; 