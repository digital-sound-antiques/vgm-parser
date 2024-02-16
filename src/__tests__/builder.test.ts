import {
  VGM,
  VGMDataStream,
  VGMWriteDataCommand,
  VGMWaitNibbleCommand,
  VGMWaitWordCommand,
  VGMEndCommand
} from "../index";

test("VGMDataStream.build", () => {
  const vgm = new VGM();
  vgm.chips.ym2413 = { clock: 3579545, dual: false };
  const stream = new VGMDataStream();
  stream.push(new VGMWriteDataCommand({ targetId: 0x51, addr: 48, data: 16 }));
  stream.markLoopPoint(); // mark here as loop point
  stream.push(new VGMWriteDataCommand({ targetId: 0x51, addr: 16, data: 172 }));
  stream.push(new VGMWriteDataCommand({ targetId: 0x51, addr: 32, data: 24 }));
  stream.push(new VGMWaitWordCommand({ count: 0xac44 }));
  stream.push(new VGMWriteDataCommand({ targetId: 0x51, addr: 32, data: 8 }));
  stream.push(new VGMWaitWordCommand({ count: 0x1588 }));
  stream.push(new VGMWriteDataCommand({ targetId: 0x51, addr: 16, data: 182 }));
  stream.push(new VGMWriteDataCommand({ targetId: 0x51, addr: 32, data: 24 }));
  stream.push(new VGMWaitWordCommand({ count: 0xac44 }));
  stream.push(new VGMWriteDataCommand({ targetId: 0x51, addr: 32, data: 8 }));
  stream.push(new VGMWaitWordCommand({ count: 0x1588 }));
  stream.push(new VGMWaitNibbleCommand({ count: 16 }));
  stream.push(new VGMEndCommand());

  expect(stream.loopIndexOffset).toBe(1);
  expect(stream.loopByteOffset).toBe(3);
  expect(new Uint8Array(stream.build())).toEqual(
    // prettier-ignore
    new Uint8Array([
      0x51, 48, 16,
      0x51, 16, 172, 
      0x51, 32, 24,
      0x61, 0x44, 0xac,
      0x51, 32, 8,
      0x61, 0x88, 0x15,
      0x51, 16, 182,
      0x51, 32, 24,
      0x61, 0x44, 0xac,
      0x51, 32, 8,
      0x61, 0x88, 0x15,
      0x7f,
      0x66
    ])
  );
});
