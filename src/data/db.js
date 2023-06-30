import mongoose from 'mongoose';

const conn = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: 'mesken',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to the DB succesully');
    })
    .catch((err) => {
      console.log(`DB connection err:, ${err}`);
    });
};

export default conn;
