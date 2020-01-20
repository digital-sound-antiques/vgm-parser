# vgm-parser [![npm version](https://badge.fury.io/js/vgm-parser.svg)](https://badge.fury.io/js/vgm-parser)
<img src="https://nodei.co/npm/vgm-parser.png?downloads=true&stars=true" alt=""/>

VGM parser / builder module for JavaScript. [Demo Site](https://digital-sound-antiques.github.io/vgm-parser/)

# Install

```
$ npm install --save vgm-parser
```

# Basic Usage

```javascript
const fs = require("fs");
const { 
  VGM, 
  VGMWriteDataCommand, 
  VGMEndCommand, 
  parseVGMCommand 
} = require("vgm-parser");

function toArrayBuffer(b) {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

const buf = fs.readFileSync("./src/__tests__/test.vgm");

/* Do not pass buf.buffer directly. It only works when buf.byteOffset == 0. */
/* fs.readFileSync often returns Buffer with byteOffset != 0. */
const vgm = VGM.parse(toArrayBuffer(buf));
console.log(vgm);

/* Iterative access for VGM commands */
let index = 0;
const data = new Uint8Array(vgm.data);
while (true) {
  try {
    const cmd = parseVGMCommand(data, index);
    console.log(cmd);
    index += cmd.size;
    if (cmd instanceof VGMEndCommand) break;
  } catch (e) {
    console.error(e);
    break;
  }
}

/* Access VGM commands as a list */
const stream = vgm.getDataStream();
for (const cmd of stream.commands) {
  if (cmd instanceof VGMWriteDataCommand) {
    console.log(cmd);
  }
}
```

# Build VGM from scratch

```javascript
const fs = require("fs");
const { 
  VGM, 
  VGMDataStream, 
  VGMWriteDataCommand, 
  VGMWaitWordCommand, 
  VGMEndCommand 
} = require("vgm-parser");

const vgm = new VGM();
vgm.chips.ym2413 = { clock: 3579545 }; // use YM2413 at 3.58MHz

const stream = new VGMDataStream();
stream.push(new VGMWriteDataCommand({ cmd: 0x51, addr: 48, data: 16 })); // set voice=@1 volume=0(max)
stream.markLoopPoint(); // mark here as loop point
stream.push(new VGMWriteDataCommand({ cmd: 0x51, addr: 16, data: 172 })); // set f-number=172
stream.push(new VGMWriteDataCommand({ cmd: 0x51, addr: 32, data: 24 })); // set oct=4, key-on
stream.push(new VGMWaitWordCommand({ count: 44100 })); // wait 1sec
stream.push(new VGMWriteDataCommand({ cmd: 0x51, addr: 32, data: 8 })); // key-off
stream.push(new VGMWaitWordCommand({ count: 44100 / 8 })); // wait 1/8 sec
stream.push(new VGMWriteDataCommand({ cmd: 0x51, addr: 16, data: 182 })); // set f-number=182
stream.push(new VGMWriteDataCommand({ cmd: 0x51, addr: 32, data: 24 })); // set oct=4, key-on
stream.push(new VGMWaitWordCommand({ count: 44100 })); // wait 1sec
stream.push(new VGMWriteDataCommand({ cmd: 0x51, addr: 32, data: 8 })); // key-off
stream.push(new VGMWaitWordCommand({ count: 44100 / 8 })); // wait 1/8 sec
stream.push(new VGMEndCommand());
console.log(stream);

vgm.setDataStream(stream);

fs.writeFileSync("output.vgz", Buffer.from(vgm.build({ compress: true })));
```
