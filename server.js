const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '')));

// API Routes
// Save donation form submissions
app.post('/api/donation', (req, res) => {
    const formData = req.body;
    const filePath = path.join(__dirname, 'data', 'donations.json');
    
    // Read existing data
    fs.readFile(filePath, (err, data) => {
        let donations = [];
        if (!err && data.length > 0) {
            donations = JSON.parse(data);
        }
        
        // Add new donation
        donations.push({
            id: Date.now(),
            ...formData,
            date: new Date().toISOString()
        });
        
        // Save back to file
        fs.writeFile(filePath, JSON.stringify(donations, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error saving donation' });
            }
            res.json({ success: true, message: 'Donation registered successfully!' });
        });
    });
});

// Cart API
app.post('/api/cart', (req, res) => {
    const cartData = req.body;
    const filePath = path.join(__dirname, 'data', 'carts.json');
    
    fs.writeFile(filePath, JSON.stringify(cartData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});