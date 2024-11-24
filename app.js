const express = require('express');   //require express
const mongoose = require('mongoose');  //require mongoose
const path = require('path');  //require path
const app = express();
const methodOverride = require('method-override');  //require method-override middleware
const Listing = require('./models/listing');  //require listing model
const Review = require('./models/review');  //require review model
const ejsmate = require('ejs-mate');  //require ejs-mate for template rendering
const wrapAsync = require('./utility/Wrapasync');  //require custom middleware
const ExpressError = require('./utility/ExpressError');  //require express-error-handling middleware

// Set up EJS for templating and static files serving
app.engine('ejs', ejsmate);  //set up ejs-mate for template rendering and rendering engine for ejs files in express.js app.
app.set('view engine', 'ejs');  //set view engine to ejs
app.use(express.static(path.join(__dirname, 'public')));  //use express static middleware to serve static files
app.use(express.urlencoded({extended: true}));  //use express body-parser middleware to parse form data
app.use(methodOverride('_method'));  //use method-override middleware to handle PUT and DELETE requests

const db = 'mongodb://127.0.0.1:27017/airbnb';

// Connect to MongoDB
mongoose.connect(db)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

//show all listings in the database
app.get('/listings', async (req, res) => {
    let data = await Listing.find();
    res.render('listings/index.ejs', {listings: data});
})

app.get('/listings/new', (req, res) => {
    res.render('listings/newAdd.ejs');
})

//create a new listing
app.post('/listings', wrapAsync(async (req, res) => {
    const listing = req.body.listing;
    const newListing = new Listing(listing);
    console.log(listing);
    await newListing.save();
    res.redirect('/listings');
}));

//edit a listing
app.get('/listings/:id/edit', async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', {listing: listing});
})

//add a review to a listing
app.post('/listings/:id/reviews', wrapAsync(async (req, res) => {
    let {id} = req.params;
    const {review} = req.body;
    // console.log(review.rating)
    const listing = await Listing.findById(id);
    let newReview = new Review(review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`listings/:${id}`);
}));

//update a listing
app.put('/listings/:id', async (req, res) => {
    let {id} = req.params;
    const updatedListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, updatedListing);
    res.redirect(`/listings/${id}`);
})

//delete a listing
app.delete('/listings/:id', async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})

//show listing details
app.get('/listings/:id', async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', {listing: listing});
})

// app.get('/testListings', async (req, res) => {
//     let data = await Listing.find({});
//     res.send(data);
// })

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message= "Something wrong happened"} = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).send(message);
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})