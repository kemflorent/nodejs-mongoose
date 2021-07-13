const mongoose = require("mongoose");

const Role = new mongoose.Schema({
    name: { type: String, trim: true, default: '' }
});

module.exports = mongoose.model('Role', Role);