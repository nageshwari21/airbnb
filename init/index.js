const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

const db = 'mongodb+srv://ghongadenisha:MhkwQOwiRmynsJlL@wunderlistcluster.zbjkonl.mongodb.net/wunderlistDB?retryWrites=true&w=majority&appName=WunderlistCluster';

mongoose.connect(db)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const initializeDatabase = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log('Database initialized with sample data');
    mongoose.connection.close();
}

initializeDatabase();
