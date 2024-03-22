const express = require('express');
const router = express.Router();
const loginService = require('../../service/login/LoginService'); // Implement this service
const messages = require('../../messages/Messages');

router.post('/verifyUser', async (req, res) => {
    const { ein } = req.body;

    if (!ein) {
        return res.status(400).json({
            responseCode: 400,
            responseMessage: "Error",
            responseData: {
                message: "The 'ein' field is required."
            }
        });
    }

    try {
        const mobile_no = await loginService.verifyUser(ein);
        res.status(200).json({
            responseCode: 200,
            responseMessage: "Success",
            responseData: {
                message: "User verified successfully.",
                mobile_no: mobile_no
            }
        });
    } catch (error) {
        res.status(400).json({
            responseCode: 400,
            responseMessage: "Error",
            responseData: {
                message: "User does not exist."
            }
        });
    }
});


// Add this new endpoint to your existing routes in OtpRoutes.js
router.post('/userDetails', async (req, res) => {
    const { ein } = req.body; // Change from req.query to req.body

    if (!ein) {
        return res.status(400).json({
            responseCode: 400,
            responseMessage: "Error",
            responseData: {
                message: "The 'ein' field is required."
            }
        });
    }

    try {
        const userDetails = await loginService.getUserDetails(ein);
        res.status(200).json({
            responseCode: 200,
            responseMessage: "Success",
            responseData: userDetails
        });
    } catch (error) {
        res.status(400).json({
            responseCode: 400,
            responseMessage: "Error",
            responseData: {
                message: "User does not exist."
            }
        });
    }
});


module.exports = router;
