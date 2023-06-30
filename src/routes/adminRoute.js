import express from 'express';
import * as adminController from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
const router = express.Router();


router.route("/admin/admin-index").get(authMiddleware, adminController.getAdminPage);
router.route("/admin/users-delete-page").get(authMiddleware, adminController.getUsersDeletePage);
router.route('/admin/:id').delete(adminController.deleteUser);


export default router;