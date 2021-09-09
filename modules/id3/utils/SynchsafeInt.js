
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
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	synchsafe2int,
	int2synchsafe
}
