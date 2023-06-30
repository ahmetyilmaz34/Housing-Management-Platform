import User from '../models/User.js';

//! Ana sayfa
const getIndexPage = async (req, res) => {
  const Kiraci = await User.countDocuments({ role: 'Kiraci' });
  const MeskenSahibi = await User.countDocuments({ role: 'Mesken-Sahibi' });
  const Yonetici = await User.countDocuments({ role: 'Yonetici' });
  res.status(200).render('index', {
    link: '/',
    Kiraci,
    MeskenSahibi,
    Yonetici
  });
}
//! Duyuru sayfası
const getDuyuruPage = (req, res) => {
  res.render("duyuru", {
    link: 'duyuru',
  });
}
//! İletisim sayfası
const getContactPage = (req, res) => {
  res.render("contact", {
    link: 'contact',
  });
}
//! Kayıt sayfası
const getRegisterPage = (req, res) => {
  res.render("register", {
    link: 'register',
  });
}
//! Login sayfası
const getLoginPage = (req, res) => {
  res.render("login", {
    link: 'login',
  });
}
//! Aidat ödeme sayfası
const getKiraciAidatPage = (req, res) => {
  res.render("kiraci/aidat", {
    link: 'aidat',
  });
}


export {
  getIndexPage,
  getDuyuruPage,
  getRegisterPage,
  getLoginPage,
  getContactPage,
  getKiraciAidatPage,
}  
