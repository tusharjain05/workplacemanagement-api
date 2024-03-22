// dbqueries.js
const db = require('../../dbconnector/DBConnector');

const queries = {
    checkUserExists: async (ein) => {
        const result = await db.oneOrNone('SELECT mobile_no FROM user_master WHERE ein = $1', [ein]);
        if (result) {
            return result;
        } else {
            throw new Error("User not found.");
        }
    },

    getUserDetails : async (ein) => {
        const query = `
        SELECT um.ein, um.email, um.mobile_no, um.first_name, um.last_name, dm.dept_name
            FROM user_master um
            JOIN dept_master dm ON um.dept_id = dm.dept_id
            WHERE um.ein = $1
        `;
        const userDetails = await db.oneOrNone(query, [ein]);
        if (!userDetails) {
            throw new Error("User not found.");
        }
        return userDetails;    }


};

module.exports = queries;



