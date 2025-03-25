const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const openai = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// OpenAI API Key
openai.api_key = "your-api-key";

// Routes
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const authenticate = require('./middleware/auth');

// Authentication Routes
app.use('/api/auth', authRoutes);

// Health Routes (protected by JWT)
app.use('/api/health', authenticate, healthRoutes);

app.post("/generate-content", async (req, res) => {
    const user_query = req.body.query;

    const response = await openai.ChatCompletion.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a health assistant providing expert health advice." },
            { role: "user", content: user_query }
        ]
    });
    
    return res.json({ content: response.choices[0].message.content });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => console.log('Error connecting to MongoDB:', err));
