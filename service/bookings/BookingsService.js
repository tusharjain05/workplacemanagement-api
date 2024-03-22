// bookingsService.js
const dbQueries = require('../../dbqueries/booking/BookingQueries');

const getBookingsByEIN = async (ein) => {
    const bookings = await dbQueries.getBookingsByEin(ein);
    if (bookings.length === 0) {
        const error = new Error('No bookings associated with this EIN.');
        error.isNotFound = true;
        throw error;
    }
    return bookings;
};


const createBooking = async (bookingData) => {
    try {
        const bookingId = await dbQueries.createBooking(bookingData);
        return bookingId;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

module.exports = {
    getBookingsByEIN,
    createBooking
};
