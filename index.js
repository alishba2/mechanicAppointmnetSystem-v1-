const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./dbConn');
const cors = require('cors'); // Add this line
const user = require('./router/userRouter');
const appointment = require('./router/appointmentRoute');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow requests from localhost:3000
app.use(bodyParser.json());

// Connect to MongoD
try {
    console.log("hello");
    connectDB();
    console.log("hello");
} catch (error) {
    console.log(error);
}


app.use('/uploads', express.static('uploads'));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, this is your Express server with Mongoose from local!');
});
app.use('/', user);
app.use('/', appointment);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
