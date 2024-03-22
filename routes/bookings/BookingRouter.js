// bookingsRoutes.js
const express = require('express');
const router = express.Router();
const bookingsService = require('../../service/bookings/BookingsService');

router.get('/getBookingsByEIN/:ein', async (req, res) => {
    try {
        const { ein } = req.params;
        const bookings = await bookingsService.getBookingsByEIN(ein);
        res.status(200).json({
            responseCode: 200,
            responseMessage: "Success",
            responseData: bookings
        });
    } catch (error) {
        if (error.isNotFound) {
            // Handle the not found error
            res.status(400).json({
                responseCode: 400,
                responseMessage: "No Booking Found",
                responseData: {
                    message: error.message
                }
            });
        } else {
            // Handle other errors
            res.status(500).json({
                responseCode: 500,
                responseMessage: "Error",
                responseData: {
                    message: error.message
                }
            });
        }
    }
});


router.post('/createBooking', async (req, res) => {
    try {
        const bookingData = req.body;
        const bookingId = await bookingsService.createBooking(bookingData);
        res.status(200).json({
            responseCode: 200,
            responseMessage: "Success",
            responseData: {
                booking_id: bookingId,
                message: "Booking successfully created."
            }
        });
    } catch (error) {
        res.status(400).json({
            responseCode: 400,
            responseMessage: "Error",
            responseData: {
                message: error.message
            }
        });
    }
});

module.exports = router;
