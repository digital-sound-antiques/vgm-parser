import { VGM } from "../index";
import fs from "fs";
import { createEmptyVGMObject } from "../vgm_object";

function toArrayBuffer(b: Buffer) {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

try {
  const buf = fs.readFileSync(process.argv[2]);
  const vgm = VGM.parse(toArrayBuffer(buf));
  console.log(vgm);
} catch (e) {
  console.error(e);
}
