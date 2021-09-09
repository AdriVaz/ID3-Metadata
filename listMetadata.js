const fs = require("fs");

const getBitAt = function(integer, bitPos) {
	return (integer >>> bitPos) & 0x1
}

const synchsafe2int = function(synchsafe) {
	let byte0 = synchsafe >>> 31 & 0xFF
	let byte1 = synchsafe >>> 16 & 0xFF
	let byte2 = synchsafe >>> 8 & 0xFF
	let byte3 = synchsafe & 0xFF

	return byte0 << 21 | byte1 << 14 | byte2 << 7 | byte3
}

const int2synchsafe = function(integer) {
	return integer << 3 & 0x7F000000 | integer << 2 & 0x007F0000 | integer << 1 & 0x00007F00 | integer & 0x0000007F
}

////////////////////////////////////////////////////////////////////////////////

if(process.argv.length < 3) {
	console.log("Usage:", process.argv[1].split("/").pop(), "<fileName>")
	process.exit()
}

fileName = process.argv[2]

////////////////////////////////////////////////////////////////////////////////

const AudioFile = function(filePath) {
	////////////////////////////////////////////////////////////
	// Define some constants
	////////////////////////////////////////////////////////////
	const HEADER_SIZE = 10;
	const HEADER_FLAGS = {
		UNSYNCHRONIZATION: "unsynchronization",
		EXTENDED_HEADER:   "extendedHeader",
		EXPERIMENTAL:      "experimental",
		FOOTER_PRESENT:    "footerPresent"
	};
	const HEADER_FLAG_SPEC = {
		3: [
			{name: HEADER_FLAGS.UNSYNCHRONIZATION, bitPos:7},
			{name: HEADER_FLAGS.EXTENDED_HEADER,   bitPos:6},
			{name: HEADER_FLAGS.EXPERIMENTAL,      bitPos:5}
		],
		4: [
			{name: HEADER_FLAGS.UNSYNCHRONIZATION, bitPos:7},
			{name: HEADER_FLAGS.EXTENDED_HEADER,   bitPos:6},
			{name: HEADER_FLAGS.EXPERIMENTAL,      bitPos:5},
			{name: HEADER_FLAGS.FOOTER_PRESENT,    bitPos:4}
		]
	};

	const FRAME_HEADER_SIZE = 10;

	////////////////////////////////////////////////////////////
	// Open the file for reading
	////////////////////////////////////////////////////////////
	this.fd = fs.openSync(filePath, "r");
	let filePosition = 0;

	////////////////////////////////////////////////////////////
	// Read Header
	////////////////////////////////////////////////////////////
	this.header = (() => {
		let buffer = Buffer.alloc(HEADER_SIZE);
		fs.readSync(this.fd, buffer, 0, HEADER_SIZE);
		filePosition += HEADER_SIZE;

		if(buffer.toString("utf-8", 0, 3) !== "ID3") {
			console.error("The file is not an ID3 audio file");
			process.exit()
		}
		
		return {
			version: buffer[3],
			revision: buffer[4],
			flags: HEADER_FLAG_SPEC[buffer[3]].filter(
				flag => getBitAt(buffer[5], flag.bitPos)
			).map(
				flag => flag.name
			),
			size: synchsafe2int(buffer.readUInt32BE(6))
		}
	})();

	////////////////////////////////////////////////////////////
	// Read Extended Header
	////////////////////////////////////////////////////////////
	if(this.header.flags.includes(HEADER_FLAGS.EXTENDED_HEADER)) {
		this.extendedHeader = (() => {
			let SIZE_INDICATOR_LENGTH = 4;
			let buffer = Buffer.alloc(1024);

			fs.readSync(fd, buffer, 0, SIZE_INDICATOR_LENGTH);
			filePosition += SIZE_INDICATOR_LENGTH;

			let size = buffer.getUInt32BE(0);
			if(header.version == 4)
				synchsafe2int(rawSize)
			
			buffer = Buffer.alloc(size)
			fs.readSync(fd, buffer, 0, size)
			filePosition += size;

			//TODO: correctly parse the extended header (not commonly used)
			const extendedHeaderParsers = {
				3: function(buffer) {
					return {msg: "Created by V3 EH parser"}
				},
				4: function(buffer) {
					return {msg: "Created by V4 EH parser"}
				}
			}

			return extendedHeaderParsers[this.header.version]();
		})();
	}

	////////////////////////////////////////////////////////////
	// Read Frames
	////////////////////////////////////////////////////////////
	this.frames = (() => {
		const BUFFER_SIZE = 1024;
		const FRAME_FLAGS = {
			3: {
				TAG_ALTER_PRESERVATION:  "tagAlterPreservation",
				FILE_ALTER_PRESERVATION: "fileAlterPreservation",
				READ_ONLY:               "readOnly",
				COMPRESSION:             "compression",
				ENCRYPTION:              "encryption",
				GROUPING_IDENTITY:       "groupingIdentity"
			},
			4: {
				TAG_ALTER_PRESERVATION:  "tagAlterPreservation",
				FILE_ALTER_PRESERVATION: "fileAlterPreservation",
				READ_ONLY:               "readOnly",
				GROUPING_IDENTITY:       "groupingIdentity",
				COMPRESSION:             "compression",
				ENCRYPTION:              "encryption",
				UNSYNCHRONIZATION:       "unsynchronization",
				DATA_LENGTH_INDICATOR:   "dataLengthIndicator"
				
			}
		}
		const FRAME_FLAGS_SPEC = {
			3: [
				{name: FRAME_FLAGS.TAG_ALTER_PRESERVATION,  bitPos:15},
				{name: FRAME_FLAGS.FILE_ALTER_PRESERVATION, bitPos:14},
				{name: FRAME_FLAGS.READ_ONLY,               bitPos:13},
				{name: FRAME_FLAGS.COMPRESSION,             bitPos:7 },
				{name: FRAME_FLAGS.ENCRYPTION,              bitPos:6 },
				{name: FRAME_FLAGS.GROUPING_IDENTITY,       bitPos:5 }
			],
			4: [
				{name: FRAME_FLAGS.TAG_ALTER_PRESERVATION,  bitPos:15},
				{name: FRAME_FLAGS.FILE_ALTER_PRESERVATION, bitPos:14},
				{name: FRAME_FLAGS.READ_ONLY,               bitPos:13},
				{name: FRAME_FLAGS.GROUPING_IDENTITY,       bitPos:6 },
				{name: FRAME_FLAGS.COMPRESSION,             bitPos:3 },
				{name: FRAME_FLAGS.ENCRYPTION,              bitPos:2 },
				{name: FRAME_FLAGS.UNSYNCHRONIZATION,       bitPos:1 },
				{name: FRAME_FLAGS.DATA_LENGTH_INDICATOR,   bitPos:0 },
			]
		}

		const frameSizeParser = {
			3: size => size,
			4: size => synchsafe2int(size)
		}

		let frames = [];
		let buffer = Buffer.alloc(BUFFER_SIZE);

		for(;;) {
			fs.readSync(this.fd, buffer, 0, FRAME_HEADER_SIZE, filePosition);
			filePosition += FRAME_HEADER_SIZE;

			let frameID = buffer.toString("utf-8", 0, 4);
			if(frameID === "\x00\x00\x00\x00") {
				// Compensate the "extra header" that is actually padding
				filePosition -= FRAME_HEADER_SIZE
				break;
			}

			let flagBytes = buffer.readUInt16BE(8);

			let frame = {
				frameID: frameID,
				size: frameSizeParser[this.header.version](buffer.readUInt32BE(4)),
				flags: FRAME_FLAGS_SPEC[this.header.version].filter(
					flag => getBitAt(flagBytes, flag.bitPos)
				).map(
					flag => flag.name
				),
				contentStart: filePosition
			};

			filePosition += frame.size;

			frames.push(frame);
		}

		return frames;
	})();

	////////////////////////////////////////////////////////////
	// Calculate padding size
	////////////////////////////////////////////////////////////
	const frameSizeReducer = (sum, frame) => sum + frame.size + FRAME_HEADER_SIZE;
	let unsynchFrameSize = this.frames.reduce(frameSizeReducer, 0);
	this.paddingSize = this.header.size - unsynchFrameSize;

	////////////////////////////////////////////////////////////
	// Calculate audio content position
	////////////////////////////////////////////////////////////
	this.audioPosition = filePosition + this.paddingSize;
}

////////////////////////////////////////////////////////////////////////////////

//const Id3Metadata = function() {

//}

let song = new AudioFile(fileName);

//let metadata = new Id3Metadata(4);
//tags.setTitle("This is title");
//tags.setArtist("This is artist");
//tags.setAlbumArt("This is album art");
//tags.setLyrics("This is lyrics");

//tags.importMetadata(song, ["TSSE", "TXXX"]);


//song.writeMetadata(metadata);



console.log("Header:", song.header);
if(song.header.flags.includes(song.HEADER_FLAGS_EXTENDED_HEADER))
	console.log("ExtendedHeader:", song.extendedHeader)
console.log("Frames:", song.frames)
console.log("PaddingSize:", song.paddingSize)
console.log("Audio position:", song.audioPosition)
