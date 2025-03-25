const express = require('express');
const router = express.Router();
const User = require('../models/User');
const openai = require('openai');

// Replace 'your-api-key' with your OpenAI API key
openai.api_key = "your-api-key";

// BMI Calculation Route
router.post('/bmi', async (req, res) => {
    const { weight, height } = req.body;
    const bmi = (weight / (height * height)).toFixed(2);

    try {
        const user = await User.findById(req.userId);
        user.bmiHistory.push(bmi);
        await user.save();
        res.status(200).json({ bmi });
    } catch (err) {
        res.status(500).json({ message: "Error calculating BMI" });
    }
});

// Water Intake Tracking Route
router.post('/water-intake', async (req, res) => {
    const { amount } = req.body; // Amount in milliliters

    try {
        const user = await User.findById(req.userId);
        user.waterIntake.push({ date: new Date(), amount });
        await user.save();
        res.status(200).json({ message: 'Water intake recorded successfully' });
    } catch (err) {
        res.status(500).json({ message: "Error recording water intake" });
    }
});

// Heart Rate Analysis Route
router.post('/heart-rate', async (req, res) => {
    const { heartRate } = req.body;

    try {
        const user = await User.findById(req.userId);
        user.heartRateHistory.push({ date: new Date(), heartRate });
        await user.save();
        res.status(200).json({ message: 'Heart rate recorded successfully' });
    } catch (err) {
        res.status(500).json({ message: "Error recording heart rate" });
    }
});

// Sleep Quality Check Route
router.post('/sleep', async (req, res) => {
    const { score } = req.body; // Score from 1 to 10

    try {
        const user = await User.findById(req.userId);
        user.sleepQuality.push({ date: new Date(), score });
        await user.save();
        res.status(200).json({ message: 'Sleep quality recorded successfully' });
    } catch (err) {
        res.status(500).json({ message: "Error recording sleep quality" });
    }
});

// Chatbot API Route
router.post("/chat", async (req, res) => {
    const user_message = req.body.message;
    
    const response = await openai.ChatCompletion.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful AI assistant for health-related queries." },
            { role: "user", content: user_message }
        ]
    });
    
    return res.json({ reply: response.choices[0].message.content });
});

module.exports = router;
