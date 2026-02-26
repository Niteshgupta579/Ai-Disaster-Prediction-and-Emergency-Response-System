import User from '../models/User.js';
import Prediction from '../models/Prediction.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPredictions = await Prediction.countDocuments();
    const dangerAlerts = await Prediction.countDocuments({ result: 'Danger' });
    const floodPredictions = await Prediction.countDocuments({ type: 'flood' });
    const earthquakePredictions = await Prediction.countDocuments({ type: 'earthquake' });

    res.json({
      totalUsers,
      totalPredictions,
      dangerAlerts,
      floodPredictions,
      earthquakePredictions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Prediction.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
