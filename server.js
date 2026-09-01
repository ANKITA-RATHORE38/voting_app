const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const bodyparser=require('body-parser');
app.use(bodyparser.json());
const PORT= process.env.PORT||3000;


// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate',candidateRoutes);
app.listen(PORT,()=>{
    console.log("listening on port 3000");
})
