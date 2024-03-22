const router = require("express").Router();

// Import route handlers
const loginRouter = require('./login/LoginRoutes');
const bookingRouter=require('./bookings/BookingRouter')
const seatRouter=require('./seat/SeatRouter')
// Define routes
router.use('/login', loginRouter);
router.use('/bookings',bookingRouter)
router.use('/seat',seatRouter)

module.exports = router;
