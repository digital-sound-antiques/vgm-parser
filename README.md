# vgm-parser
[![npm version](https://badge.fury.io/js/vgm-parser.svg)](https://badge.fury.io/js/vgm-parser)

VGM parser module for JavaScript.

# Install
```
$ npm install --save vgm-parser
```

# Usage
## Basic Usage
```javascript
const { VGM } = require("vgm-parser");

const arrayBuffer = /* load raw VGM binary to ArrayBuffer */

const vgm = VGM.parse(arrayBuffer);

console.log(vgm.gd3tag.trackTitle);
```

## Node
```javascript
const { VGM } = require("vgm-parser");

function toArrayBuffer(b) {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

const buf = fs.readFileSync("test.vgm");

/* Do not pass buf.buffer directly. It only works when buf.byteOffset == 0. */
/* fs.readFileSync often returns Buffer with byteOffset != 0. */
const vgm = VGM.parse(toArrayBuffer(buf)); 

console.log(vgm.gd3tag.trackTitle);
```

## Node - VGZ file support
```javascript
const zlib = require("zlib");
const { VGM } = require("vgm-parser");

function toArrayBuffer(b) {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

function loadVgmOrVgz(file) {
  let vgmContext: Buffer;
  const buf = fs.readFileSync(file);
  try {
    return zlib.gunzipSync(buf);
  } catch (e) {
    return buf;
  }
}

const buf = loadVgmOrVgz("test.vgz");

const vgm = VGM.parse(toArrayBuffer(buf));

console.log(vgm.gd3tag.trackTitle);
```

