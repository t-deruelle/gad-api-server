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

// ✅ Correct GET route for fetching authorizations
const DISPOSAL_SITE_ID = "E360-ACCEPT-50100"; // Use the correct disposal site ID

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
        console.error("Error fetching authorizations:", error.response?.data || error.message);
        res.status(500).json({ error: "Error fetching authorizations", details: error.message });
    }
});

// ✅ Correct PUT route for updating authorization by ID
app.put('/api/authorizations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const response = await axios.put(`${API_BASE_URL}/authorizations/${id}`, updateData, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du billet' });
    }
});

// ✅ Default route to catch errors (Optional)
app.get('*', (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
});

