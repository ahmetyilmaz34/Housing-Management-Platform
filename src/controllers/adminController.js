import User from '../models/User.js';
import Mesken from '../models/Mesken.js';
import Category from '../models/Category.js';


//! Admin Page
const getAdminPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID });
  const users = await User.find();
  const categories = await Category.find();
  const meskenler = await Mesken.find({ user: req.session.userID });
  res.render("admin/admin-index", {
    link: 'admin-index',
    user,
    users,
    categories,
    meskenler,
  });
}
const getUsersDeletePage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID });
  const users = await User.find();
  const categories = await Category.find();
  const meskenler = await Mesken.find({ user: req.session.userID });
  res.render("admin/users-delete", {
    link: 'users-delete',
    user,
    users,
    categories,
    meskenler,
  });
}
//! Kullanıcı Silme
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    await Mesken.deleteMany({ user: req.params.id });
    res.status(200).redirect('admin/users-delete-page');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};




export {
  getAdminPage,
  deleteUser,
  getUsersDeletePage

};