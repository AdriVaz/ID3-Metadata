# ID3 Metadata Reader/Writer

This program receives an MP3 file as an input and prints its ID3 metadata in a low level. The goal of this project is to implement an ID3 reader/writer without using any external libraries, just looking at the specifications, for learning purposes.

For any serious use, there are many ID3 metadata handling programs and libraries available, this is just a learning project.

**The code in the repo is just the skeleton of the project** (it is incomplete). The "classes" (implemented as JavaScript functions) are created, as well as the callings between them. Some of the low level file reading logic is not included in the main project (the metadata frames parsing logic), but is implemented in the `listMetadata.js` file. The conversion of parsed structures back into bytes is also missing.


## ID3 Specification

ID3 version 2.3 metadata:
http://id3lib.sourceforge.net/id3/id3v2.3.0.html

ID3 version 2.4 metadata:
https://id3.org/id3v2.4.0-structure

The `ID3-docs` contain a summarised version of the structure of the ID3 metadata blocks.

