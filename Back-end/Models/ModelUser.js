//Importe la librairie
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//model de schema user
const UserSchema = mongoose.Schema({
    email:{ type: String, required: true, unique: true },
    password:{ type: String, required: true },
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Users', UserSchema);