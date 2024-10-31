const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: String,
    email: { type: String, unique: true },
    password: String,
});

const Register = mongoose.model('Register', userSchema);
module.exports = Register;
