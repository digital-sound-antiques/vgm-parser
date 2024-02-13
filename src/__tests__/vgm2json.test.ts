import { VGM } from "../index";
import fs from "fs";

function toArrayBuffer(b: Buffer) {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

test("VGMDataStream.build", () => {
  const buf = fs.readFileSync("./src/__tests__/test.vgm");
  const vgm = VGM.parse(toArrayBuffer(buf));
  expect(vgm.version.major).toBe("1");
  expect(vgm.version.minor).toBe("70");
  expect(vgm.chips.ym2413).not.toBeNull();
});
