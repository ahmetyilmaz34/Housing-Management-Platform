import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import * as yoneticiController from "../controllers/yoneticiController.js";
const router = express.Router();



router.route("/yonetici/yonetici-index").get(authMiddleware, yoneticiController.getYoneticiPage);



//! Mesken Sakinleri ROUTES
router.route("/auth").get(authMiddleware, yoneticiController.getAllUsers);
router.route("/auth/:id").get(authMiddleware, yoneticiController.getAUser);

//! Arıza Onarım ROUTES
router.route("/yonetici/ariza-onarim").get(authMiddleware, yoneticiController.getArizaOnarimPage);
router.route("/yonetici/photos/:id").put(yoneticiController.updateYoneticiPhoto);
router.route("/yonetici/photos/:id").delete(yoneticiController.deleteYoneticiPhoto);
router.route("/yonetici/photos/:id").get(yoneticiController.getYoneticiAPhoto);

//! Demirbas Routes
router.get('/yonetici/demirbas/home', authMiddleware, yoneticiController.homepage);
router.get('/yonetici/demirbas/add', authMiddleware, yoneticiController.addDemirbas);
router.post('/yonetici/demirbas/add', authMiddleware, yoneticiController.postDemirbas);
router.get('/yonetici/demirbas/view/:id', authMiddleware, yoneticiController.view);
router.get('/yonetici/demirbas/edit/:id', authMiddleware, yoneticiController.edit);
router.put('/yonetici/demirbas/edit/:id', authMiddleware, yoneticiController.editPost);
router.delete('/yonetici/demirbas/edit/:id', authMiddleware, yoneticiController.deleteDemirbas);
router.post('/yonetici/demirbas/search', authMiddleware, yoneticiController.searchDemirbas);


//! MESKEN İŞLEMLERİ ROUTES
router.route("/yonetici/mesken-ekle").get(authMiddleware, yoneticiController.getMeskenEklePage);
router.route("/yonetici/meskenler").get(authMiddleware, yoneticiController.getMeskenlerPage);
router.route("/yonetici/bloklar").get(authMiddleware, yoneticiController.getBloklarPage);
router.route('/yonetici/mesken-create').post(roleMiddleware(["Yonetici", "admin"]), yoneticiController.createYoneticiMesken);
router.route('/yonetici/all-mesken').get(yoneticiController.getYoneticiAllMeskenler);
// router.route('/yonetici/mesken-yonetici-bilgi/:slug').get(yoneticiController.getYoneticiMeskenBilgi);
router.route('/yonetici/mesken-yonetici-bilgi/:slug/:id').get(yoneticiController.getYoneticiMeskenBilgi);
router.route('/yonetici/mesken/:slug').get(yoneticiController.getYoneticiMesken);
router.route('/yonetici/mesken/:slug').delete(yoneticiController.deleteYoneticiMesken);
router.route('/yonetici/mesken/:slug').put(yoneticiController.updateYoneticiMesken);
router.route('/yonetici/mesken/enroll').post(yoneticiController.enrollYoneticiMesken);
router.route('/yonetici/mesken/releaseYonetici').post(yoneticiController.releaseYoneticiMesken);
//! Category Routes
router.route('/yonetici/blok').post(yoneticiController.createCategory);
router.route('/yonetici/blok/:id').delete(yoneticiController.deleteCategory);


//! MUHASEBE ROUTES
router.route("/yonetici/aidat").get(authMiddleware, yoneticiController.getAidatPage);



export default router;
