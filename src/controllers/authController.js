import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Photo from '../models/photoModel.js';
import Category from '../models/Category.js';
import Mesken from '../models/Mesken.js';

//! Kullanıcı olusturma
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    const errors = validationResult(req);
    console.log(errors);
    console.log(errors.array()[0].msg);
    for (let i = 0; i < errors.array().length; i++) {
      req.flash('error', `${errors.array()[i].msg}`);
    }
    res.status(400).redirect('/register');
  }
};
//! Kullanıcı login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          req.session.userID = user._id;
          res.status(200).redirect('/auth/dashboard');
        } else {
          req.flash('error', 'Kullanıcı bilgileri doğru değil!');
          res.status(400).redirect('/login');
        }
      });
    } else {
      req.flash('error', 'Kullanıcı mevcut değil!');
      res.status(400).redirect('/login');
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
//! Kullanıcı logout
const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

//! Genel Dashboard
const getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    'meskenler'
  );
  const photos = await Photo.find({ user: req.session.userID });
  const categories = await Category.find();
  const meskenler = await Mesken.find({ user: req.session.userID });
  const users = await User.find();
  res.status(200).render('dashboard', {
    link: 'dashboard',
    user,
    categories,
    meskenler,
    users,
    photos
  });
};






export {
  createUser,
  loginUser,
  logoutUser,
  getDashboardPage,
};