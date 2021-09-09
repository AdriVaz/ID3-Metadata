
const {AudioFile} = require("./modules/AudioFile");
const util = require("util");

(async () => {

	if(process.argv.length < 3) {
		console.log("Usage: " + process.argv[1].split("/").pop() + " <mp3-file-path>")
		process.exit(1)	
	}
	console.log(process.argv)

	songFile = process.argv[2];

	let song = await new AudioFile(songFile);
	console.log(song)

	console.log("########################################")
	console.log(song.metadata.frames);
	console.log("########################################")



})();

