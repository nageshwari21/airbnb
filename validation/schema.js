const Joi = require('joi');


// Listing schema validation
let listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required().max(100),
        description: Joi.string().required().max(500),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null)
    })
});

//export the schema
module.exports = listingSchema;