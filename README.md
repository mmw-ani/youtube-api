# Assignment

Fetch youtube video details based on predefined query(Cricket) and save it to database.


<hr />

## API Documentation
`GET` /api/video
- Fetch video list from data
- Query params option available : query, limit, page
	- Query is used for searching (Eg. ipl,sachin)
	- Limit is used for number of results (Eg. 10,20,25)
	- Page is used for page number (Eg. 1,2,3,...) 
	- Api after adding param = `http://localhost:4001/api/video?limit=10&page=1&query=ipl` 
> Sample request :
```
  GET https://localhost:4001/api/video
```
> Successful response 
```
  [
     {
	"_id":"625fc42bd9472b4cbdd21144",
      	"publishedAt":"2022-04-20T07:34:07.000Z",
	"title":"Cricket shorts #shorts #cricket #viral",
	"thumbnailLink":"https://i.ytimg.com/vi/Rme_OJfvIc4/hqdefault.jpg",
	"description":"",
	"channelTitle":"AB Rock",
	"__v":0
     },
     ...
  ]
```
<br >

For Running this project on local host
## Run the project locally 
## 1. Clone the `youtube-api` project
```
git clone https://www.github.com/mmw-ani/youtube-api.git
```
## 2. Rename sample-config.js file to config.js and set mongodb uri and youtube api key 
```
// config.js file 
MONGODB_URI = "your_mongo_db_url"
YOUTUBEID = ['apikey']
```
## 3. Install package dependencies 
Open the terminal
```
cd youtube-api
npm install
```
## 4. Start development Server
```
npm start
```
> Backend server runs on localhost:4001 by default