
const {ID3Header} = require("./ID3Header");

const {ID3TextFrame} = require("./FrameTypes/ID3TextFrame");
const {ID3LyricsFrame} = require("./FrameTypes/ID3LyricsFrame");
const {ID3ImageFrame} = require("./FrameTypes/ID3ImageFrame");

const myutils = require("../Utils");
const constants = require("./ID3Constants");

////////////////////////////////////////////////////////////////////////////////
// Constructor
////////////////////////////////////////////////////////////////////////////////

const ID3Metadata = function() {
	myutils.dispatchCall(this, arguments, [
		[ID3MetadataEmpty, []],
		[ID3MetadataParse, ["buffer"]],
	], "ID3Metadata");
}

const ID3MetadataEmpty = function() {
	this.header = new ID3Header();
	this.paddingSize = constants.DEFAULT_PADDING_SIZE;
	this.frames = [];
}

const ID3MetadataParse = function(fileContent) {
	this.header = new ID3Header(fileContent);

	// Padding size is calciulated from the total size, and
	// then subtracting the lengths of each known chunk
	//let paddingSize = this.header.totalSize;

	if(this.header.isExtendedHeaderPresent())
		this.extendedHeader = new ID3ExtendedHeader(fileContent);

	if(this.header.isFooterPresent())
		this.footer = new ID3Footer(fileContent);

	this.frames = parseFrames(fileContent, this.header.version);

	this.paddingSize = (() => {
		let size = this.header.totalSize;

		if(this.extendedHeader) {
			size -= this.extendedHeader.size;
			if(this.header.verion == 3)
				paddingSize -= constants.EXTENDED_HEADER_V3_SIZE_MARKER_LENGTH;
		}

		if(this.footer)
			size -= constants.FOOTER_SIZE

		this.frames.forEach(frame => {
			size -= frame.payloadSize;
			size -= constants.FRAME_HEADER_SIZE;
		});

		return size;
	})();

}

const parseFrames = function(fileContent, id3Version) {
	// TODO: parse actual file
	let text   = new ID3TextFrame("TIT2", "utf-8", "This is song title", id3Version);
	let lyrics = new ID3LyricsFrame("utf-8", "This is lyrics metadata", id3Version);
	let image  = new ID3ImageFrame("utf-8", "image/png", Buffer.alloc(16), id3Version);
	return [text, lyrics, image];
}

////////////////////////////////////////////////////////////////////////////////
// Methods
////////////////////////////////////////////////////////////////////////////////

ID3Metadata.prototype.setTitle = function() {

}

ID3Metadata.prototype.setArtist = function() {

}

ID3Metadata.prototype.setLyrics = function() {

}

ID3Metadata.prototype.setImage = function() {

}

ID3Metadata.prototype.toBytes = function() {

}

////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	ID3Metadata
}
