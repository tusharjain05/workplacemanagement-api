const db = require('../../dbconnector/DBConnector');

const getSeatsAndStatusByDepartment = async (dept_id, current_date) => {
    const query = `
        SELECT
            sm.seat_id,
            rm.row_id,
            cm.column_id,
            CASE
                WHEN bm.seat_status_id IS NOT NULL THEN ssm.seat_status
                ELSE 'Available'
            END AS seat_status,
            bm.start_time,
            bm.end_time
        FROM
            seat_master sm
        JOIN row_master rm ON sm.row_id = rm.row_id
        JOIN column_master cm ON sm.column_id = cm.column_id
        LEFT JOIN booking_master bm ON sm.seat_id = bm.seat_id
            AND bm.booking_date = $2
        LEFT JOIN seat_status_master ssm ON bm.seat_status_id = ssm.seat_status_id
        WHERE
            (rm.dept_id = $1 OR cm.dept_id = $1)
        GROUP BY
            sm.seat_id, rm.row_id, cm.column_id, bm.seat_status_id, ssm.seat_status, bm.start_time, bm.end_time
        ORDER BY
            sm.seat_id;
    `;
    return db.any(query, [dept_id, current_date]);
};


const getBookingDetailsBySeatId = async (seat_id) => {
    const query = `
        SELECT
            bm.booking_id,
            um.first_name,
            um.last_name,
            bm.start_time,
            bm.end_time
        FROM
            booking_master bm
        JOIN user_master um ON bm.ein = um.ein
        WHERE
            bm.seat_id = $1
        ORDER BY
            bm.start_time;
    `;
    return db.oneOrNone(query, [seat_id]); // Assumes there can be only one active booking per seat at a time
};

module.exports = {
    getSeatsAndStatusByDepartment,
    getBookingDetailsBySeatId 
};
