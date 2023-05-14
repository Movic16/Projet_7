//Importe la librairie
const mongoose = require('mongoose');

//model de schema
const BookSchema = mongoose.Schema({
    title:{ type: String, required: true },
    author:{ type: String, required: true },
    imageUrl:{ type: String, required: true },
    year:{ type: Number, required: true },
    genre:{ type: String, required: true },
    ratings:[
        {
            grade:{ type: Number, required: true },
        }
    ],
    averageRating:{ type: String, required: true },
});

module.exports = mongoose.model('ModelBook', BookSchema);