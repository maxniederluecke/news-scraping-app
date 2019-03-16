var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    name: {
        type: String,
        default: "User"},
    body: {
        type: String,
        required: true
    },
    timeSubmitted: {
        type: Date, 
        default: Date.now 
    }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;