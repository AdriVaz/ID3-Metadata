
const id3 = require("./id3/ID3Metadata");
const myutils = require("./Utils");

////////////////////////////////////////////////////////////////////////////////
// Constructor
////////////////////////////////////////////////////////////////////////////////

const AudioFile = function(source) {
	return (async() => {
		this.rawContent = await myutils.readFile(source);

		this.metadata = new id3.ID3Metadata(this.rawContent);

		//this.audioOffset = //Get from metadata
		//this.audioOffset = this.metadata.header.totalSize + id3.HEADER_SIZE;

		this.newMetadata = new id3.ID3Metadata();

		return this;
	})();
}

////////////////////////////////////////////////////////////////////////////////
// Methods
////////////////////////////////////////////////////////////////////////////////

//AudioFile.prototype.getMetadata = function() {
//    return this.metadata;
//}

AudioFile.prototype.updateMetadata = function(meta) {
	// Update only the provided metadata and don't touch the other ones
	meta.title  && this.newMetadata.setTitle(meta.title);
	meta.artist && this.newMetadata.setArtist(meta.artist);
	meta.lyrics && this.newMetadata.setLyrics(meta.lyrics);
	meta.image  && this.newMetadata.setImage(meta.image);
}

AudioFile.prototype.save = function(path) {

}

////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	AudioFile
}
