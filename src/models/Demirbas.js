import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const DemirbasSchema = new Schema({
  demirbasAdi: {
    type: String,
    required: true
  },
  demirbasTur: {
    type: String,
    required: true
  },
  adet: {
    type: String,
    required: true
  },
  konum: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});


const Demirbas = mongoose.model('Demirbas', DemirbasSchema);

export default Demirbas;
