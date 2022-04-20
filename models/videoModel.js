const mongoose = require('mongoose');
const schema = mongoose.Schema;

const videoModel = new schema({
	publishedAt: Date,
	title: String,
	thumbnailLink: String,
	description: String,
	channelTitle: String
});

module.exports = mongoose.model('Video', videoModel);
