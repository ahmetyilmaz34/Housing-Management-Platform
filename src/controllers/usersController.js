import Photo from "../models/photoModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import User from '../models/User.js';
import Category from '../models/Category.js';
import Mesken from '../models/Mesken.js';


//! Kiraci Page
const getKiraciPage = async (req, res) => {
  res.render("kiraci/kiraci-index", {
    link: 'kiraci',
  });
}

//! Mesken Sahibi Page
const getMeskenSahibiPage = (req, res) => {
  res.render("mesken-sahibi/mesken-sahibi-index", {
    link: 'mesken-sahibi',
  });
}

// ********************** PHOTOS CONTROLLERS **********************
//! Foto olusturma
const createPhoto = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'mesken-yonetimi',
    }
  );
  try {
    await Photo.create({
      name: req.body.name,
      description: req.body.description,
      user: req.session.userID,
      url: result.secure_url,
      image_id: result.public_id,
    });
    fs.unlinkSync(req.files.image.tempFilePath);
    res.status(201).redirect('/auth/dashboard');
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};
//! Tüm fotoları getirme
const getAllPhotos = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const photos = res.locals.user
      ? await Photo.find({ user: { $ne: res.locals.user._id } })
      : await Photo.find({});
    res.status(200).render('photos', {
      photos,
      user,
      link: 'photos',
    })
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};
//! Foto tekil sayfası
const getAPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const photo = await Photo.findById({ _id: req.params.id }).populate('user');
    let isOwner = false;
    if (req.session.userID) {
      isOwner = photo.user.equals(req.session.userID);
    }
    res.status(200).render('photo', {
      photo,
      user,
      link: 'photo',
      isOwner,
    });
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};
//! Foto silme
const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    const photoId = photo.image_id;
    await cloudinary.uploader.destroy(photoId);
    await Photo.findOneAndRemove({ _id: req.params.id });
    res.status(200).redirect('/auth/dashboard');
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};
//! Foto güncelleme
const updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (req.files) { // gelen bir dosya var ise
      const photoId = photo.image_id;
      await cloudinary.uploader.destroy(photoId);
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          use_filename: true,
          folder: 'mesken-yonetimi',
        }
      );
      photo.url = result.secure_url;
      photo.image_id = result.public_id;
      fs.unlinkSync(req.files.image.tempFilePath);// tmp klasöründeki geçici oluşan photoları siler 
    }
    photo.name = req.body.name;
    photo.description = req.body.description;
    photo.save();
    res.status(200).redirect(`/users/photos/${req.params.id}`);
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};







//! Kullanıcı Tarafı  Tüm daireler
const getMeskenlerPage = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const query = req.query.search;
    const category = await Category.findOne({ slug: categorySlug })
    let filter = {};
    if (categorySlug) {
      filter = { category: category._id }
    }
    if (query) {
      filter = { name: query }
    }
    if (!query && !categorySlug) {
      filter.name = "",
        filter.category = null
    }
    const meskenler = await Mesken.find({
      $or: [
        { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
        { category: filter.category }
      ]
    }).sort('createdAt').populate('user');
    const categories = await Category.find();
    res.status(200).render('meskenler', {
      meskenler,
      categories,
      link: 'meskenler',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
}
const getMeskenKayit = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const mesken = await Mesken.findOne({ slug: req.params.slug }).populate('user')
    const categories = await Category.find();
    res.status(200).render('mesken-kayit', {
      mesken,
      link: 'mesken-kayit',
      user,
      categories
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
//! Kullanıcı Tarafı Daire tekil sayfası
const getMeskenBilgiPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    'meskenler'
  );
  const categories = await Category.find();
  const meskenler = await Mesken.find({ user: req.session.userID });
  const users = await User.find();
  res.status(200).render('mesken-bilgi', {
    link: 'mesken-bilgi',
    user,
    categories,
    meskenler,
    users,

  });
}

const deleteUserMesken = async (req, res) => {
  try {
    const mesken = await Mesken.findOneAndRemove({ slug: req.params.slug })
    req.flash("error", `${mesken.name} başarıyla kaldırıldı`);
    res.status(200).redirect('/meskenler');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
const updateUserMesken = async (req, res) => {
  try {
    const mesken = await Mesken.findOne({ slug: req.params.slug });
    mesken.name = req.body.name;
    mesken.description = req.body.description;
    mesken.category = req.body.category;
    mesken.save();
    res.status(200).redirect('/meskenler');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

const enrollMesken = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.session.userID });
    await user.meskenler.push({ _id: req.body.mesken_id });
    await user.save();
    res.status(200).redirect('mesken-bilgi');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
const releaseMesken = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.meskenler.pull({ _id: req.body.mesken_id });
    await user.save();
    res.status(200).redirect('mesken-bilgi');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};



export {
  getKiraciPage,
  getMeskenSahibiPage,
  createPhoto,
  getAllPhotos,
  getAPhoto,
  deletePhoto,
  updatePhoto,
  getMeskenlerPage,
  getMeskenKayit,
  getMeskenBilgiPage,
  deleteUserMesken,
  updateUserMesken,
  enrollMesken,
  releaseMesken
};