import mongoose from 'mongoose';
import slugify from 'slugify';
const Schema = mongoose.Schema;

const MeskenSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  odaSayisi: {
    type: String,

    required: true,
  },
  metreKare: {
    type: String,

    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

MeskenSchema.pre('validate', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true
  })
  next();
})

const Mesken = mongoose.model('Mesken', MeskenSchema);
export default Mesken;