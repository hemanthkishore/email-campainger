const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReceiverSchema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String
    },
    unsubscribe: {
        type: Boolean,
        default: false
    }
});


module.exports = ReceiverSchema;
