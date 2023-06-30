import express from 'express'
import * as usersController from '../controllers/usersController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();


router.route("/kiraci-index").get(authMiddleware, usersController.getKiraciPage);
router.route("/mesken-sahibi-index").get(authMiddleware, usersController.getMeskenSahibiPage);


//! Kullancı Tarafı Photo Routes
router.route('/users/photos').post(usersController.createPhoto).get(usersController.getAllPhotos);
router.route("/users/photos/:id").get(usersController.getAPhoto);
router.route("/users/photos/:id").delete(usersController.deletePhoto);
router.route("/users/photos/:id").put(usersController.updatePhoto);



//! Kullancı Tarafı Mesken Routes
router.route("/users/meskenler").get(usersController.getMeskenlerPage);
router.route("/users/mesken-bilgi").get(usersController.getMeskenBilgiPage);
router.route('/users/:slug').get(usersController.getMeskenKayit,);
router.route('/users/:slug').delete(usersController.deleteUserMesken);
router.route('/users/:slug').put(usersController.updateUserMesken);
router.route('/users/enroll').post(usersController.enrollMesken);
router.route('/users/release').post(usersController.releaseMesken);



export default router;


