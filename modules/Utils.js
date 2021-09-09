
const util = require("util");
const fs = require("fs");

////////////////////////////////////////////////////////////////////////////////
// File managing
////////////////////////////////////////////////////////////////////////////////

const readFile = util.promisify(fs.readFile);

////////////////////////////////////////////////////////////////////////////////
// Bit operations
////////////////////////////////////////////////////////////////////////////////

const getBitAt = function(integer, bitPos) {
	return (integer >>> bitPos) & 0x1
}

const setBitAt = function(integer, bitPos, value) {
	
}

////////////////////////////////////////////////////////////////////////////////
// Call dispatcher and argument checker
////////////////////////////////////////////////////////////////////////////////

const NO_ERROR         = 0;
const SIZE_ERROR       = 1;
const TYPE_ERROR       = 2;
const USER_CHECK_ERROR = 3;

const checkArgs = function(args, specTypeList, userChecks) {
	const specialCheckers = {
		"array": Array.isArray,
		"buffer": Buffer.isBuffer,
		"object": function(i) {
			return typeof i == "object" && !Array.isArray(i) && !Buffer.isBuffer(i)
		}
	};

	// Argument number must be the same
	if(args.length !== specTypeList.length)
		return SIZE_ERROR;

	// Arguments must have the correct type
	for(let i = 0; i < specTypeList.length; i++) {
		let specialChecker = specialCheckers[specTypeList[i]];

		if(specialChecker) {
			if(!specialChecker(args[i]))
				return TYPE_ERROR;
		} else {
			if(typeof args[i] !== specTypeList[i])
				return TYPE_ERROR;
		}
	}

	// Perform additional user-established checks
	if(!userChecks)
		return NO_ERROR;

	let typeDependentChecks     = Object.keys(userChecks).filter(key => isNaN(parseInt(key)));
	let positionDependentChecks = Object.keys(userChecks).filter(key => !isNaN(parseInt(key)));

	for(let i = 0; i < args.length; i++) {
		let typeDependentCheck     = typeDependentChecks[specTypeList[i]];
		let positionDependentCheck = positionDependentChecks[i];

		if(typeDependentCheck && !userChecks[typeDependentCheck](args[i]))
			return USER_CHECK_ERROR;

		if(positionDependentCheck && !userChecks[positionDependentCheck](args[i]))
			return USER_CHECK_ERROR;
	}

	return NO_ERROR;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This function receives a list of functions with a list of the types of the arguments they accept, and a set of arguments,
// and returns the function whose param types match the types of the arguments provided.
//
// This is used in the code to implement some kind of "constructor overloading",
// where there are two functions with the same name but different arguments.
// Here, there is one constructor function that can be called with any arguments, and depending on them,
// an auxiliary function is called. This auxiliary functions are "different constructors"
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const dispatchCall = function(thisValue, args, specList, errorLocation) {
	const errorMsgs = {
		/*SIZE_ERROR*/       1: () => errorLocation + ": incorrect argument size: " + [...new Set(specList.map(spec => spec[1].length))].sort().join(" or ")                 + " expected",
		/*TYPE_ERROR*/       2: () => errorLocation + ": incorrect argument type: " + specList.filter(s => s[1].length == args.length).map(e => e[1].join(",")).join(" or ") + " expected",
		/*USER_CHECK_ERROR*/ 3: () => errorLocation + ": user checks failed and no function was called"
	}

	let validArgCounts = specList.map(spec => spec[1].length);

	if(!validArgCounts.includes(args.length)) {
		let message = errorMsgs[SIZE_ERROR]();
		throw new Error(message)
	}

	let typeErrorHappened = false;
	let userCheckErrorHappened = false;

	for(let i = 0; i < specList.length; i++) {
		let retval = checkArgs(args, specList[i][1], specList[i][2]);

		if(retval == NO_ERROR)
			return specList[i][0].call(thisValue, ...args);

		if(retval == TYPE_ERROR)
			typeErrorHappened = true;
		
		if(retval == USER_CHECK_ERROR)
			userCheckErrorHappened = true;
	}

	if(typeErrorHappened) {
		let message = errorMsgs[TYPE_ERROR]();
		throw new Error(message)
	}

	if(userCheckErrorHappened) {
		let message = errorMsgs[USER_CHECK_ERROR]();
		throw new Error(message)
	}

	// Should never be reached
	let message = "Something went wrong during dispatchCall";
	throw new Error(message)

}

////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	readFile,
	getBitAt,
	dispatchCall
}
