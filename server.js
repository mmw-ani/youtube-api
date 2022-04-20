const express = require('express');
const mongoose = require('mongoose');
const MONGODB_URI = require('./config').MONGODB_URI;
const videoRoutes = require('./routes/videoRoutes');

const PORT = process.env.PORT || 4001;
const app = express();

app.use(express.json());
app.use('/api', videoRoutes);

const initializeAndInitiateServer = async () => {
	mongoose
		.connect(MONGODB_URI)
		.then((_) => {
			app.listen(PORT, () => {
				console.log(`Database Connected and server Started`);
			});
		})
		.catch((err) => {
			console.log(`Error white connecting Database ${err}`);
		});
};

initializeAndInitiateServer();
