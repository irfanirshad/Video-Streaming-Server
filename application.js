// Video Streaming server using NodeJS

const express = require("express");
const fs = require("fs") ;
const app = express() ;

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.get("/video", function (req,res) {
	const range = req.headers.range;
		if(!range){
		res.status(400).send("Requires Range header");
		}

	const videoPath = "video.mp4" ;
	const videoSize = fs.statSync("video.mp4").size;

	// Parse Range
	// Example: "bytes=32324-"
	const CHUNK_SIZE = 10 ** 6; //1MB
	const start = Number(range.replace(/\D/g, ""));
	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

	const contentLength = end - start + 1 ;
	const headers = {
		"Content-Range": `bytes ${start} - ${end}/${videoSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	};

	res.writeHead(206, headers);

	//magic
	const videoStream = fs.createReadStream(videoPath, {start, end }) ;

	//pipe it
	videoStream.pipe(res);

});

app.listen(8000, function() {
	console.log("Listening on port 8000!");
}) ;
