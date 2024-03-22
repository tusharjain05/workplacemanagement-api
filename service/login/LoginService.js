const LoginQueries = require('../../dbqueries/login/LoginQueries');
const messages = require('../../messages/Messages');


const verifyUser = async (ein) => {
    const userExists = await LoginQueries.checkUserExists(ein);
    if (!userExists) {
        throw new Error("User does not exist.");
    }
    return userExists.mobile_no;
};

const getUserDetails = async (ein) => {
    const userDetails = await LoginQueries.getUserDetails(ein);
    if (!userDetails) {
        throw new Error("ser does not exist.");
    }
    return userDetails;
};

module.exports = {
    verifyUser,
    getUserDetails
};
