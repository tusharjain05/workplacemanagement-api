const express = require('express');
const router = express.Router();
const seatsService = require('../../service/seat/SeatService');

router.post('/getSeatsByDepartment', async (req, res) => {
    try {
        const { dept_id, current_date } = req.body;
        if (!dept_id || !current_date) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Error",
                responseData: { message: "dept_id and current_date are required" }
            });
        }

        const seatDetails = await seatsService.getSeatsByDepartment(dept_id, current_date);
        if (seatDetails.length === 0) { // Check if no seats found for the department
            return res.status(400).json({
                responseCode: 400,
                responseMessage: "Error",
                responseData: { message: "Department does not exist." }
            });
        }
        res.json({
            responseCode: 200,
            responseMessage: "Success",
            responseData: seatDetails
        });
    } catch (error) {
        res.status(500).json({ 
            responseCode: 500,
            responseMessage: "Error",
            responseData: { message: error.message }
        });
    }
});


router.get('/getBookingDetailsBySeatId', async (req, res) => {
    try {
        const { seat_id } = req.query;
        if (!seat_id) {
            return res.status(400).json({
                message: "seat_id is required"
            });
        }

        const bookingDetails = await seatsService.getBookingDetailsBySeatId(seat_id);
        res.json({
            responseCode: 200,
            responseMessage: "Success",
            responseData: bookingDetails
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
