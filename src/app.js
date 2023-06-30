import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import methodOverride from 'method-override';
import flash from 'connect-flash';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";


import conn from "./data/db.js";
import pageRoute from "./routes/pageRoute.js"
import authRoute from "./routes/authRoute.js"
import usersRoute from "./routes/usersRoute.js";
import yoneticiRoute from "./routes/yoneticiRoute.js";
import adminRoute from "./routes/adminRoute.js";


//* env
dotenv.config();
//* cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});
//* connection to the DB 
conn();

const app = express();
const port = process.env.PORT;

//* ejs template engine -->
app.set("view engine", "ejs");
app.set("views", "./src/views");

//* Global Variable
global.userIN = null;

//* static files middleware(arayazılımlar) 
app.use(express.static('./src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('node_modules'));
app.use(
  session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);


// * flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use(fileUpload({ useTempFiles: true }));
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);


//* ROUTES
app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  next();
});

app.use("/", pageRoute);
app.use('/auth', authRoute);
app.use("/", usersRoute);
app.use("/users", usersRoute);
app.use("/", yoneticiRoute);
app.use("/yonetici", yoneticiRoute);
app.use("/",  adminRoute);
app.use("/admin",  adminRoute);






app.listen(port, () => {
  console.log(`Application running on:${port}`);
})






























