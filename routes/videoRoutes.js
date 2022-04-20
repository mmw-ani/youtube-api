const express = require('express');
const router = express.Router();
const axios = require('axios');
const Video = require('../models/videoModel');
const APIKEYS = require('../config').YOUTUBEID;
const SECONDSDELAY = 10;

let publishedAfterDate = new Date('2022-04-20');
let indexForAPIKeys = 0;
let intervalRef = null;

// Fetching youtube videos and saving into the database based on query = cricket and ordered by date published after some datetime.
const fetchAndSaveVideoData = async (date) => {
	try {
		const GETVIDEOURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=100&order=date&q=cricket&type=video&publishedAfter=${date}&key=${APIKEYS[indexForAPIKeys]}`;
		let responseFromYoutubeApi = await axios.get(GETVIDEOURL);
		responseFromYoutubeApi = responseFromYoutubeApi.data.items;
		const dataToSaveInDB = [];
		responseFromYoutubeApi.forEach((video) => {
			const videoDetails = video.snippet;

			// Formatting the data to save in mongodb datebase.
			const formattedData = {
				publishedAt: videoDetails.publishedAt,
				title: videoDetails.title,
				description: videoDetails.description,
				thumbnailLink: videoDetails.thumbnails.high?.url,
				channelTitle: videoDetails.channelTitle
			};
			dataToSaveInDB.push(formattedData);
		});
		await Video.insertMany(dataToSaveInDB);
		return;
	} catch (err) {
		// If quota is exhausted for particular api key and there are some api keys left, so it will use that api key for further process.
		if (err?.response?.data?.error?.errors[0]?.reason === 'quotaExceeded' && indexForAPIKeys < APIKEYS.length) {
			indexForAPIKeys++;
		} else {
			// If issue is other thant quoto exceed than it will simply clear the interval and process will stop.
			clearInterval(intervalRef);
		}
		console.log(err);
	}
};

// A Set Interval for calling the above function after every 10 or specified second.
intervalRef = setInterval(() => {
	fetchAndSaveVideoData(publishedAfterDate.toISOString());
	publishedAfterDate.setSeconds(publishedAfterDate.getSeconds() + SECONDSDELAY);
}, SECONDSDELAY * 1000);

// Route for video fetching/searching from database.
router.get('/video', async (req, res) => {
	try {
		const { limit = 10, pageNumber = 1, query = null } = req.query;
		let videoFilter = {};
		if (query) {
			// If there is search query then using regex to match the string pattern.
			videoFilter = { $or: [{ title: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }] };
		}

		const videoList = await Video.find(videoFilter)
			.sort({ publishedAt: -1 }) // sorting by decreasing order of publishedAt
			.limit(limit)
			.skip(limit * (pageNumber - 1));
		return res.send(videoList);
	} catch (err) {
		console.log(err);
		return res.status(501).json({ message: 'Error Occurred' });
	}
});

module.exports = router;
