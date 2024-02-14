const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const authRouter = require('./routes/auth'); 


// Connect to MongoDB 
mongoose.connect(process.env.MONGODB_URI) 
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware (we'll add more here later)
app.use(express.json()); // Parses request bodies

// Mount routes
app.use('/api/auth', authRouter); 

console.log(process.env.PORT)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
