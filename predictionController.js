import { spawn } from 'child_process';
import path from 'path';
import Prediction from '../models/Prediction.js';
import { sendSMSAlert } from '../utils/sms.js';
import axios from 'axios';

const runPythonScript = (scriptPath, args) => {
  return new Promise((resolve, reject) => {
    const python = spawn(process.env.PYTHON_PATH || 'python', [scriptPath, ...args]);
    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(error || 'Python script failed'));
      } else {
        try {
          resolve(JSON.parse(output));
        } catch (e) {
          reject(new Error('Invalid JSON from Python script'));
        }
      }
    });
  });
};

export const predictFlood = async (req, res) => {
  try {
    const { rainfall, temperature, humidity, waterLevel, latitude, longitude, address } = req.body;

    const scriptPath = path.join(process.env.ML_MODEL_PATH, 'predict.py');
    const result = await runPythonScript(scriptPath, [
      'flood',
      rainfall,
      temperature,
      humidity,
      waterLevel
    ]);

    const prediction = await Prediction.create({
      userId: req.user._id,
      type: 'flood',
      inputData: { rainfall, temperature, humidity, waterLevel },
      result: result.prediction,
      probability: result.probability,
      location: { latitude, longitude, address }
    });

    if (result.prediction === 'Danger') {
      const message = `⚠️ FLOOD ALERT: High risk detected in your area. Probability: ${(result.probability * 100).toFixed(1)}%. Stay safe!`;
      await sendSMSAlert(req.user.phone, message);
      prediction.alertSent = true;
      await prediction.save();
    }

    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const predictEarthquake = async (req, res) => {
  try {
    const { magnitude, depth, latitude, longitude, address } = req.body;

    const scriptPath = path.join(process.env.ML_MODEL_PATH, 'predict.py');
    const result = await runPythonScript(scriptPath, [
      'earthquake',
      magnitude,
      depth,
      latitude,
      longitude
    ]);

    const prediction = await Prediction.create({
      userId: req.user._id,
      type: 'earthquake',
      inputData: { magnitude, depth, latitude, longitude },
      result: result.prediction,
      probability: result.probability,
      location: { latitude, longitude, address }
    });

    if (result.prediction === 'Danger') {
      const message = `⚠️ EARTHQUAKE ALERT: High seismic risk detected. Magnitude: ${magnitude}, Probability: ${(result.probability * 100).toFixed(1)}%. Take precautions!`;
      await sendSMSAlert(req.user.phone, message);
      prediction.alertSent = true;
      await prediction.save();
    }

    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
