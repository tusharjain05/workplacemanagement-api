const seatsQueries = require('../../dbqueries/seat/SeatQueries');

const getSeatsByDepartment = async (dept_id, current_date) => {
    return seatsQueries.getSeatsAndStatusByDepartment(dept_id, current_date);
};

const getBookingDetailsBySeatId = async (seat_id) => {
    return seatsQueries.getBookingDetailsBySeatId(seat_id);
};

module.exports = {
    getSeatsByDepartment,getBookingDetailsBySeatId 
};
