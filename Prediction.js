import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['flood', 'earthquake'],
    required: true
  },
  inputData: {
    type: Object,
    required: true
  },
  result: {
    type: String,
    enum: ['Safe', 'Alert', 'Danger'],
    required: true
  },
  probability: {
    type: Number,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  alertSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Prediction', predictionSchema);
