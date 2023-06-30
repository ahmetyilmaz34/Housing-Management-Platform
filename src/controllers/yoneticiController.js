import Photo from "../models/photoModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import User from '../models/User.js';
import Category from '../models/Category.js';
import Mesken from '../models/Mesken.js';
import Demirbas from "../models/Demirbas.js";
import mongoose from "mongoose";



//! Yonetici Page
const getYoneticiPage = async (req, res, next) => {
    const user = await User.findOne({ _id: req.session.userID });
    const users = await User.find();
    res.status(200).render("yonetici/yonetici-index", {
        link: 'yonetici',
        user,
        users,
    });
};

// ********************** Mesken Sakinleri CONTROLLERS **********************
//! Bütün Kullanıcıların Listelenmesi
const getAllUsers = async (req, res) => {
    try {
        const kiracilar = await User.find({ role: 'Kiraci' });
        const meskenSahibi = await User.find({ role: 'Mesken-Sahibi' });
        res.status(200).render('yonetici/mesken-sakinleri/users', {
            kiracilar,
            meskenSahibi,
            link: 'users',
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
//! Kullanıcı Tekil Sayfası
const getAUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).populate(
            'meskenler'
        );
        const photos = await Photo.find({ user: user._id });
        // const meskenler = await Mesken.find({ user: user._id });
        const meskenler = await Mesken.find({ user: req.params.id });
        res.status(200).render('yonetici/mesken-sakinleri/user', {
            user,
            photos,
            meskenler,
            link: 'user',
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const getYoneticiMeskenBilgi = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).populate(
            'meskenler'
        );
        
        const mesken = await Mesken.findOne({ slug: req.params.slug }).populate('user')
        const categories = await Category.find();
        res.status(200).render('yonetici/mesken-sakinleri/mesken-yonetici-bilgi', {
            mesken,
            link: 'mesken-yonetici-bilgi',
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

// ********************** ARIZA-ONARIM CONTROLLERS **********************
//! Arıza-Onarım sayfası
const getArizaOnarimPage = async (req, res) => {
    const photos = res.locals.user
        ? await Photo.find({ user: { $ne: res.locals.user._id } })
        : await Photo.find({});
    res.render("yonetici/genel-islemler/ariza-onarim", {
        link: 'ariza-onarim',
        photos,
    });
}
//! Yonetici tarafı tekil foto sayfası
const getYoneticiAPhoto = async (req, res) => {
    try {
        const photos = res.locals.user
        const user = await User.findById(req.session.userID);
        const photo = await Photo.findById({ _id: req.params.id }).populate('user');
        const Yonetici = await User.countDocuments({ role: 'Yonetici' });
        res.status(200).render('yonetici/genel-islemler/ariza-photo', {
            photo,
            photos,
            user,
            Yonetici,
            link: 'photo',
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
//! Yonetici tarafı foto silme
const deleteYoneticiPhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        const photoId = photo.image_id;
        await cloudinary.uploader.destroy(photoId);
        await Photo.findOneAndRemove({ _id: req.params.id });
        res.status(200).redirect('/yonetici/ariza-onarim');
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
//! Yonetici tarafı foto güncelleme
const updateYoneticiPhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (req.files) {
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
        res.status(200).redirect('/yonetici/ariza-onarim');
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};




// ********************** CATEGORY CONTROLLERS **********************
//! Blok olusturma
const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).redirect('/yonetici/bloklar');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};
//! Blok silme
const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndRemove(req.params.id)
        res.status(200).redirect('/yonetici/bloklar');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};












//! MUHASEBE --- Yonetici tarafı aidat sayfası
const getAidatPage = (req, res) => {
    res.render("yonetici/muhasebe-islemleri/aidat", {
        link: 'aidat',
    });
}

//! MESKEN İŞLEMLERİ --- Mesken ekleme sayfası
const getMeskenEklePage = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userID });
    const users = await User.find();
    const meskenler = await Mesken.find({ user: req.session.userID });
    const categories = await Category.find();
    res.render("yonetici/mesken-islemleri/mesken-ekle", {
        link: 'mesken-ekle',
        user,
        users,
        meskenler,
        categories,
    });
}
//! MESKEN İŞLEMLERİ --- Daireler sayfası
const getMeskenlerPage = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userID });
    const users = await User.find();
    const meskenler = await Mesken.find({ user: req.session.userID });
    const categories = await Category.find();
    res.render("yonetici/mesken-islemleri/meskenler", {
        link: 'meskenler',
        user,
        users,
        meskenler,
        categories,
    });
}
//! MESKEN İŞLEMLERİ --- Bloklar sayfası
const getBloklarPage = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userID });
    const users = await User.find();
    const meskenler = await Mesken.find({ user: req.session.userID });
    const categories = await Category.find();
    res.render("yonetici/mesken-islemleri/bloklar", {
        link: 'bloklar',
        user,
        users,
        meskenler,
        categories,
    });
}
//! MESKEN İŞLEMLERİ --- Mesken Ekleme sayfası 
const getMeskeneEkleme = async (req, res) => {
    const user = await User.findById({ _id: req.params.id });
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
        }).sort('-createdAt').populate('user');
        const categories = await Category.find();
        res.status(200).render('yonetici/mesken-sakinleri/meskene-ekleme', {
            user,
            meskenler,
            categories,
            link: 'meskene-ekleme',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};


// ********************** MESKEN CONTROLLERS **********************
//! Mesken olusturma
const createYoneticiMesken = async (req, res) => {
    try {
        const mesken = await Mesken.create({
            name: req.body.name,
            odaSayisi: req.body.odaSayisi,
            metreKare: req.body.metreKare,
            description: req.body.description,
            category: req.body.category,
            user: req.session.userID
        });
        req.flash("success", `${mesken.name} başarıyla oluşturuldu`);
        res.status(201).redirect('/yonetici/mesken-ekle');
    } catch (error) {
        req.flash("error", `Eklenemedi!`);
        res.status(400).redirect('/yonetici/mesken-ekle');
    }
};
//! Tüm meskenleri getirme
const getYoneticiAllMeskenler = async (req, res) => {
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
        res.status(200).render('yonetici/mesken-islemleri/meskenler', {
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
};
//! Mesken tekil sayfası
const getYoneticiMesken = async (req, res) => {
    try {
        const user = await User.findById(req.session.userID);
        const mesken = await Mesken.findOne({ slug: req.params.slug }).populate('user')
        const categories = await Category.find();
        res.status(200).render('yonetici/mesken-islemleri/mesken', {
            mesken,
            link: 'mesken',
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

//! Mesken silme
const deleteYoneticiMesken = async (req, res) => {
    try {
        const mesken = await Mesken.findOneAndRemove({ slug: req.params.slug })
        req.flash("error", `${mesken.name} başarıyla kaldırıldı`);
        res.status(200).redirect('/yonetici/mesken-ekle');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};
//! Mesken güncelleme
const updateYoneticiMesken = async (req, res) => {
    try {
        const mesken = await Mesken.findOne({ slug: req.params.slug });
        mesken.name = req.body.name;
        mesken.description = req.body.description;
        mesken.odaSayisi = req.body.odaSayisi;
        mesken.metreKare= req.body.metreKare;
        mesken.category = req.body.category;
        mesken.save();
        res.status(200).redirect('/yonetici/mesken-ekle');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};





//! Yonetici Tarafı Mesken kayıt
const enrollYoneticiMesken = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        await user.meskenler.push({ _id: req.body.mesken_id });
        await user.save();
        res.status(200).render('yonetici/mesken-sakinleri/users');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

//! Yonetici Tarafı Meskenden kullanıcı kayıt silme
const releaseYoneticiMesken = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        await user.meskenler.pull({ _id: req.body.mesken_id });
        await user.save();
        res.status(200).redirect('/auth'),{
            user
        };
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};


// ********************** DEMİRBAS CONTROLLERS **********************
//! Demirbas anasayfa
const homepage = async (req, res) => {
    const messages = await req.flash('success');
    let perPage = 12;
    let page = req.query.page || 1;
    try {
        const demirbas = await Demirbas.find();
        const demirbaslar = await Demirbas.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Demirbas.count();
        res.render('yonetici/genel-islemler/demirbas', {
            demirbaslar,
            link: 'demirbas',
            current: page,
            pages: Math.ceil(count / perPage),
            messages,
            demirbas
        });
    } catch (error) {
        console.log(error);
    }
}
//! Demirbas ekleme sayfası
const addDemirbas = async (req, res) => {
    res.render("yonetici/genel-islemler/add");
};

//! Demirbas eklenen verileri gönderme (demirbas olusturma)
const postDemirbas = async (req, res) => {
    const newDemirbas = new Demirbas({
        demirbasAdi: req.body.demirbasAdi,
        demirbasTur: req.body.demirbasTur,
        details: req.body.details,
        adet: req.body.adet,
        konum: req.body.konum,
    });
    try {
        await Demirbas.create(newDemirbas);
        await req.flash("success", "Yeni Kayıt Eklendi");
        res.redirect("/yonetici/demirbas/home");
    } catch (error) {
        console.log(error);
    }
};
//! Demirbas tekil sayfası
const view = async (req, res) => {
    try {
        const demirbas = await Demirbas.findOne({ _id: req.params.id })
        res.render('yonetici/genel-islemler/view', {
            demirbas
        })
    } catch (error) {
        console.log(error);
    }
}
//! Demirbas edit sayfası 
const edit = async (req, res) => {
    try {
        const demirbas = await Demirbas.findOne({ _id: req.params.id })
        res.render('yonetici/genel-islemler/edit', {
            demirbas
        })
    } catch (error) {
        console.log(error);
    }
}
//! Demirbas edit sayfası verilerini gönderme (demirbas güncelleme)
const editPost = async (req, res) => {
    try {
        await Demirbas.findByIdAndUpdate(req.params.id, {
            demirbasAdi: req.body.demirbasAdi,
            demirbasTur: req.body.demirbasTur,
            details: req.body.details,
            adet: req.body.adet,
            konum: req.body.konum,
            updatedAt: Date.now()
        });
        await res.redirect(`/yonetici/demirbas/edit/${req.params.id}`);
    } catch (error) {
        console.log(error);
    }
}
//! Demirbas silme
const deleteDemirbas = async (req, res) => {
    try {
        await Demirbas.deleteOne({ _id: req.params.id });
        await req.flash("info", "Kayıt Silindi");
        res.redirect("/yonetici/demirbas/home")
    } catch (error) {
        console.log(error);
    }
}
//! Demirbas arama- filtreleme
const searchDemirbas = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        const demirbaslar = await Demirbas.find({
            $or: [
                { demirbasAdi: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                { demirbasTur: { $regex: new RegExp(searchNoSpecialChar, "i") } },
            ]
        });
        res.render('yonetici/genel-islemler/search', {
            demirbaslar
        })
    } catch (error) {
        console.log(error);
    }
}







export {
    getYoneticiPage,
    getAllUsers,
    getAUser,
    getYoneticiMeskenBilgi,
    createCategory,
    deleteCategory,
    getYoneticiAPhoto,
    deleteYoneticiPhoto,
    updateYoneticiPhoto,
    getArizaOnarimPage,
    getMeskenEklePage,
    getMeskenlerPage,
    getBloklarPage,
    getAidatPage,
    getMeskeneEkleme,
    createYoneticiMesken,
    getYoneticiAllMeskenler,
    getYoneticiMesken,
    deleteYoneticiMesken,
    updateYoneticiMesken,
    enrollYoneticiMesken,
    releaseYoneticiMesken,
    homepage,
    addDemirbas,
    postDemirbas,
    view,
    edit,
    editPost,
    deleteDemirbas,
    searchDemirbas
};

