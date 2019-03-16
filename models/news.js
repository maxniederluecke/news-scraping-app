var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NewsSchema = new Schema({
	headline: {
		type: String,
		require: true
	},
	summary: {
		type: String,
		require: true
	},
	url: {
		type: String,
		require:  true
	},
	comment: [{
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

var News = mongoose.model("News", NewsSchema);

module.exports = News;