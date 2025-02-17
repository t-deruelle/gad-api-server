const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const API_BASE_URL = 'https://api.accept.montreal.ca/environment/collections/v1';
const API_KEY = process.env.API_KEY;
const DISPOSAL_SITE_ID = "E360-ACCEPT-50100"; // Correct disposal site ID

// 🔍 Ensure API_KEY is set
if (!API_KEY) {
    console.error("❌ ERROR: Missing API_KEY in environment variables!");
}

// ✅ GET route for fetching authorizations
app.get("/api/authorizations", async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/v1/disposal-authorizations`, {
            params: {
                disposalSiteId: DISPOSAL_SITE_ID,
                stateId: 500 // Only stateId 500 is allowed
            },
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ ERROR: Fetching authorizations failed:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            error: "Error fetching authorizations", 
            details: error.response?.data || error.message 
        });
    }
});

// ✅ PUT route for updating authorization by ID
app.put('/api/authorizations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const response = await axios.put(`${API_BASE_URL}/v1/disposal-authorizations/${id}`, updateData, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ ERROR: Updating authorization failed:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            error: "Error updating authorization", 
            details: error.response?.data || error.message 
        });
    }
});

// ✅ POST route for creating a new disposal authorization (Required for testing)
app.post('/api/authorizations', async (req, res) => {
    try {
        const requestData = req.body;

        const response = await axios.post(`${API_BASE_URL}/v1/test/authorization`, requestData, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ ERROR: Creating authorization failed:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            error: "Error creating authorization", 
            details: error.response?.data || error.message 
        });
    }
});

// ✅ Catch-all route for non-existent endpoints (Must be at the bottom)
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// ✅ Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
});
