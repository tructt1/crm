var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchemal = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: Boolean,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('User', UserSchemal);