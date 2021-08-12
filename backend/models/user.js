const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // unique is not for validation as is required, but for internal mongoose/mongoDB optimizations performance
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // generate error on duplicate email attempt

module.exports = mongoose.model('User', userSchema);