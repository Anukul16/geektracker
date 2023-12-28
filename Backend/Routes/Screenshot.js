const express = require('express');
const router = express.Router();
const screenshot = require('screenshot-desktop');



router.post('/captureSS', async (req, res) => {
    try {
        // Capture the screen using node-desktop-screenshot
        const dummyImageBuffer = await screenshot();

        // Send the image buffer in the response
        res.status(200).send(dummyImageBuffer);
    } catch (err) {
        console.error('Error capturing and saving screenshot:', err);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
