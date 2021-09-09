
const {ID3Frame} = require("../ID3Frame");
const myutils = require("../../Utils");

////////////////////////////////////////////////////////////////////////////////
// Constructor
////////////////////////////////////////////////////////////////////////////////

const ID3ImageFrame = function() {
	myutils.dispatchCall(this, arguments, [
		[ID3ImageFrameEmpty, ["string", "string", "buffer", "number"]],
		[ID3ImageFrameParse, ["buffer", "number"]]
	], "ID3ImageFrame");
}

const ID3ImageFrameEmpty = function(encoding, mimeType, imageData, id3Version) {
	//Inherit attributes
	ID3Frame.call(this, "APIC", id3Version);

	this.encoding = encoding;
	this.mimeType = mimeType;
	this.imageType = 03; //Cover (front)
	this.description = "";
	this.imageData = imageData;
	
}

const ID3ImageFrameParse = function(buffer, id3Version) {
	//Inherit attributes
	ID3Frame.call(this, buffer, id3Version);

}

////////////////////////////////////////////////////////////////////////////////
// Inherit Methods
////////////////////////////////////////////////////////////////////////////////

// Inherit methods
ID3ImageFrame.prototype = Object.create(ID3Frame.prototype);

// Set the constructor method back to its correct value
Object.defineProperty(ID3ImageFrame.prototype, 'constructor', {
	value: ID3ImageFrame,
	enumerable: false,
	writable: true
});

////////////////////////////////////////////////////////////////////////////////
// Methods
////////////////////////////////////////////////////////////////////////////////

ID3ImageFrame.prototype.toBytes = function() {
	// Call super for toBytes() method
	ID3Frame.prototype.toBytes.call(this);

	// ....
}

////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	ID3ImageFrame
}
