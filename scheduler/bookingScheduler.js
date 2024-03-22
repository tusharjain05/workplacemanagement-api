// const schedule = require('node-schedule');
// const db = require('../dbconnector/DBConnector'); // Make sure the path is correct

// const updateLapsedBookings = async () => {
//     const now = new Date();
//     const currentTimestamp = now.toISOString(); // Convert to a format suitable for SQL

//     const lapsedBookingsQuery = `
//         UPDATE seat_master
//         SET seat_status_id = (SELECT seat_status_id FROM seat_status_master WHERE seat_status = 'Available')
//         WHERE seat_id IN (
//             SELECT bm.seat_id
//             FROM booking_master bm
//             INNER JOIN seat_master sm ON bm.seat_id = sm.seat_id
//             WHERE bm.end_time <= $1
//             AND sm.seat_status_id != (SELECT seat_status_id FROM seat_status_master WHERE seat_status = 'Available')
//         )
//         RETURNING seat_id;
//     `;

//     try {
//         const updatedSeats = await db.any(lapsedBookingsQuery, [currentTimestamp]);
//         console.log(`Updated seats to available: ${updatedSeats.map(s => s.seat_id).join(', ')}`);
//     } catch (error) {
//         console.error('Error updating lapsed bookings:', error);
//     }
// };

// // Schedule the job to run at the start of every minute
// const job = schedule.scheduleJob('* * * * *', updateLapsedBookings);

// // Optional: if you want to trigger the job immediately upon server start
// // updateLapsedBookings();

// module.exports = {
//     updateLapsedBookings,
//     job
// };
