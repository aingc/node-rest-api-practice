require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });//connect to db
const db = mongoose.connection; //we can hook up some events to run when our db is connected to
//see if there's a problem connecting to the db
//**NOTE NEED TO MAKE SURE MONGODB IS INSTALLED LOCALLY OR THIS WILL BREAK */
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database')); //this will only run once, once we are connected

//setup server to accept json, app.use allows to use any middleware we want which is essentially code that runs when server gets request but before it gets passed to routes
app.use(express.json());

const subscribersRouter = require('./routes/subscribers');
app.use('/subscribers', subscribersRouter); //use this whenever we query subscribers
//'localhost:3000/subscribers'

app.listen(3000, () => console.log('Server Started'));