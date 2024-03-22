// dbqueries.js
const db = require('../../dbconnector/DBConnector');

const queries = {
    getBookingsByEin: async (ein) => {
        const bookingsQuery =  `
        SELECT 
            bm.booking_id,
            TO_CHAR(bm.booking_date, 'YYYY-MM-DD') as booking_date,
            bm.start_time,
            bm.end_time,
            btm.booking_type_values as booking_type,
            bm.seat_id,
            cm.column_id as col_no,
            rm.row_id as row_no,
            dm.dept_name,
            ssm.seat_status
        FROM booking_master bm
        JOIN booking_type_master btm ON bm.booking_type_id = btm.booking_type_id
        JOIN seat_status_master ssm ON bm.seat_status_id = ssm.seat_status_id
        JOIN seat_master sm ON bm.seat_id = sm.seat_id
        JOIN row_master rm ON sm.row_id = rm.row_id
        JOIN column_master cm ON sm.column_id = cm.column_id
        JOIN dept_master dm ON rm.dept_id = dm.dept_id
        WHERE bm.ein = $1
    `;

        const result = await db.any(bookingsQuery, [ein]);
        return result.map(booking => ({
            booking_id: booking.booking_id,
            booking_date: booking.booking_date,
            start_time: booking.start_time,
            end_time: booking.end_time,
            booking_type: booking.booking_type,
            seat_details: {
                seat_id: booking.seat_id,
                col_no: booking.col_no,
                row_no: booking.row_no,
                dept_name: booking.dept_name,
                seat_status: booking.seat_status
            }
        }));
    },

    createBooking: async (bookingData) => {
        return db.tx(async t => {
            const conflictCheckQuery = `
                SELECT 1 FROM booking_master
                WHERE seat_id = $1
                AND booking_date = $2
                AND NOT (
                    start_time >= $4 OR
                    end_time <= $3
                )`;
            const conflictExists = await t.any(conflictCheckQuery, [
                bookingData.seat_id,
                bookingData.booking_date,
                bookingData.start_time,
                bookingData.end_time
            ]);

            if (conflictExists.length > 0) {
                throw new Error("Booking cannot be created due to a time conflict. Please change the time.");
            }

            const bookingTypeQuery = 'SELECT booking_type_id FROM booking_type_master WHERE booking_type_values = $1';
            const bookingType = await t.one(bookingTypeQuery, [bookingData.booking_type]);

            // Determine the seat_status_id based on booking_type
            const seatStatusIdMap = {
                "Full Day Booking": 1,
                "Slot Booking": 3
            };
            const seatStatusId = seatStatusIdMap[bookingData.booking_type];

            const insertBookingQuery = `
                INSERT INTO booking_master 
                (ein, seat_id, booking_date, start_time, end_time, booking_type_id, created_at, created_by, updated_at, updated_by, is_deleted, seat_status_id)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'system', NOW(), 'system', false, $7)
                RETURNING booking_id;
            `;
            const newBooking = await t.one(insertBookingQuery, [
                bookingData.ein,
                bookingData.seat_id,
                bookingData.booking_date,
                bookingData.start_time,
                bookingData.end_time,
                bookingType.booking_type_id,
                seatStatusId
            ]);

            return newBooking.booking_id;
        });
    }
    
    

};

module.exports = queries;
