const express = require('express');
const http = require('http');
const port=4001
const bodyParser = require('body-parser');  // Import body-parser

const indexRouter = require('./routes/IndexRoutes');
//const { updateLapsedBookings } = require('./scheduler/bookingScheduler'); // Adjust the path to the actual location of your booking scheduler

let app = express();

// Use body-parser middleware to parse JSON request bodies
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
(async () => {
    try {
        //   console.log('Database connection successful. Starting the server...');
        console.log("Connected to the database");

        //updateLapsedBookings();

        // Schedule the job to run periodically
        // const schedule = require('node-schedule');
        // // This will schedule the job to run every minute
        // schedule.scheduleJob('* * * * *', updateLapsedBookings);

        // Use your router here
        app.use(indexRouter);

        http.createServer(app).listen(4001, '192.168.1.7', function () {
            console.log('Server Started on port: 4001');
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1); // Exit the process if database connection fails
    }
})();

app.listen(process.env.port||port)
