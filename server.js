const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/check', async (req, res) => {
    const url = req.query.url;
    try {
        const response = await fetch(url);
        res.json({
            status: response.ok ? 'up' : 'down',
            statusCode: response.status
        });
    } catch (error) {
        res.json({
            status: 'down',
            error: error.message
        });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
}); 