import {
  parseVGMCommand,
  VGMWriteDataCommand,
  VGMWaitNibbleCommand,
  VGMWaitWordCommand,
  VGMWait735Command,
  VGMWait882Command,
  VGMSetupStreamCommand,
  VGMSetStreamDataCommand,
  VGMSetStreamFrequencyCommand,
  VGMStartStreamFastCommand,
  VGMStopStreamCommand,
  VGMStartStreamCommand,
  VGMPCMRAMWriteCommand,
  VGMDataBlockCommand,
  VGMSeekPCMCommand,
  VGMWrite2ACommand,
  VGMEndCommand,
  VGMWriteDataTargetId,
} from "../index";

test("VGMWriteDataCommand", () => {
  const cmd = new VGMWriteDataCommand({ targetId: VGMWriteDataTargetId.ym2413, addr: 16, data: 172 });
  expect(cmd.size).toBe(3);
  expect(cmd.toObject()).toEqual({ chip: "ym2413", cmd: 0x51, index: 0, port: 0, addr: 16, data: 172, size: 3 });
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x51, 16, 172]));

  const cpy = cmd.copy({ targetId: VGMWriteDataTargetId.ym2413_2, data: 182 });
  expect(cpy.toUint8Array()).toEqual(new Uint8Array([0xa1, 16, 182]));
});

test("VGMWaitNibCommand 7xH", () => {
  const cmd = new VGMWaitNibbleCommand({ count: 1 });
  expect(cmd.size).toBe(1);
  expect(cmd.count).toBe(1);
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x70]));
  const cpy = cmd.copy({ count: 15 });
  expect(cpy.toUint8Array()).toEqual(new Uint8Array([0x7e]));
});

test("VGMWaitWordCommand 61H", () => {
  const cmd = new VGMWaitWordCommand({ count: 32 });
  expect(cmd.size).toBe(3);
  expect(cmd.count).toBe(32);
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x61, 0x20, 0x00]));
  const cpy = cmd.copy({ count: 15 });
  expect(cpy.toUint8Array()).toEqual(new Uint8Array([0x61, 0x0f, 0x00]));
});

test("VGMWait735Command 62H", () => {
  const cmd = new VGMWait735Command();
  expect(cmd.size).toBe(1);
  expect(cmd.count).toBe(735);
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x62]));
  expect(cmd.clone().toUint8Array()).toEqual(new Uint8Array([0x62]));
});

test("VGMWait882Command 63H", () => {
  const cmd = new VGMWait882Command();
  expect(cmd.size).toBe(1);
  expect(cmd.count).toBe(882);
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x63]));
  expect(cmd.clone().toUint8Array()).toEqual(new Uint8Array([0x63]));
});

test("VGMDataBlockCommand", () => {
  const obj = { blockType: 0x04, blockSize: 0x5, blockData: new Uint8Array([1, 2, 3, 4, 5]) };
  const cmd = new VGMDataBlockCommand(obj);
  expect(cmd.cmd).toBe(0x67);
  expect(cmd.size).toBe(12);
  expect(cmd.toObject()).toEqual({ cmd: 0x67, chip: "okim6258", size: 12, ...obj });
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x67, 0x66, 0x04, 0x05, 0x00, 0x00, 0x00, 1, 2, 3, 4, 5]));
});

test("VGMPCMRAMWriteCommand", () => {
  const obj = { blockType: 0x20, readOffset: 0x123456, writeOffset: 0x123456, writeSize: 0x123456 };
  const cmd = new VGMPCMRAMWriteCommand(obj);
  expect(cmd.cmd).toBe(0x68);
  expect(cmd.size).toBe(12);
  expect(cmd.toObject()).toEqual({ cmd: 0x68, size: 12, ...obj });
  expect(cmd.toUint8Array()).toEqual(
    new Uint8Array([0x68, 0x66, 0x20, 0x56, 0x34, 0x12, 0x56, 0x34, 0x12, 0x56, 0x34, 0x12]),
  );
});

test("VGMWrite2ACommand", () => {
  const obj = { cmd: 0x88 };
  const cmd = new VGMWrite2ACommand({ count: 8 });
  expect(cmd.cmd).toBe(0x88);
  expect(cmd.size).toBe(1);
  expect(cmd.count).toBe(8);
  expect(cmd.toObject()).toEqual({ count: 8, size: 1, ...obj });
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x88]));
});

test("VGMSeekPCMCommand", () => {
  const obj = { offset: 0x12345678 };
  const cmd = new VGMSeekPCMCommand(obj);
  expect(cmd.cmd).toBe(0xe0);
  expect(cmd.size).toBe(5);
  expect(cmd.toObject()).toEqual({ cmd: 0xe0, size: 5, ...obj });
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0xe0, 0x78, 0x56, 0x34, 0x12]));
});

test("VGMSetupStreamCommand", () => {
  const obj = { streamId: 1, type: 0, port: 0, channel: 1 };
  const cmd = new VGMSetupStreamCommand(obj);
  expect(cmd.cmd).toBe(0x90);
  expect(cmd.size).toBe(5);
  expect(cmd.toObject()).toEqual({ cmd: 0x90, size: 5, ...obj });
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x90, 0x01, 0x00, 0x00, 0x01]));
});

test("VGMSetStreamDataCommand", () => {
  const obj = { streamId: 1, dataBankId: 2, stepSize: 3, stepBase: 4 };
  const cmd = new VGMSetStreamDataCommand(obj);
  expect(cmd.cmd).toBe(0x91);
  expect(cmd.size).toBe(5);
  expect(cmd.toObject()).toEqual({ cmd: 0x91, size: 5, ...obj });
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x91, 0x01, 0x02, 0x03, 0x04]));
});

test("VGMSetStreamFrequencyCommand", () => {
  const obj = { streamId: 1, frequency: 15000 };
  const cmd = new VGMSetStreamFrequencyCommand(obj);
  expect(cmd.cmd).toBe(0x92);
  expect(cmd.size).toBe(6);
  expect(cmd.toObject()).toEqual({ cmd: 0x92, size: 6, ...obj });
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x92, 0x01, 0x98, 0x3a, 0x00, 0x00]));
});

test("VGMStartStreamCommand", () => {
  const obj = { streamId: 1, offset: 0x100, lengthMode: 0x01, dataLength: 0x8000 };
  const cmd = new VGMStartStreamCommand(obj);
  expect(cmd.cmd).toBe(0x93);
  expect(cmd.size).toBe(11);
  expect(cmd.toObject()).toEqual({ cmd: 0x93, size: 11, ...obj });
  expect(cmd.toUint8Array()).toEqual(
    new Uint8Array([0x93, 0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00]),
  );
});

test("VGMStopStreamCommand", () => {
  const obj = { streamId: 1 };
  const cmd = new VGMStopStreamCommand(obj);
  expect(cmd.cmd).toBe(0x94);
  expect(cmd.size).toBe(2);
  expect(cmd.toObject()).toEqual({ cmd: 0x94, size: 2, ...obj });
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x94, 0x01]));
});

test("VGMStartStreamFastCommand", () => {
  const obj = { streamId: 1, blockId: 0x0010, flags: 0x03 };
  const cmd = new VGMStartStreamFastCommand(obj);
  expect(cmd.cmd).toBe(0x95);
  expect(cmd.size).toBe(5);
  expect(cmd.toObject()).toEqual({ cmd: 0x95, size: 5, ...obj });
  expect(cmd.toUint8Array()).toEqual(new Uint8Array([0x95, 0x01, 0x10, 0x00, 0x03]));
});

test("parseVGMCommand", () => {
  expect(() => {
    parseVGMCommand([0], 0);
  }).toThrow("Parse Error");
  expect(parseVGMCommand([0x4f, 0], 0)).toBeInstanceOf(VGMWriteDataCommand);
  expect(parseVGMCommand([0x50, 0], 0)).toBeInstanceOf(VGMWriteDataCommand);
  expect(parseVGMCommand([0x51, 0, 0], 0)).toBeInstanceOf(VGMWriteDataCommand);
  expect(parseVGMCommand([0xa1, 0, 0], 0)).toBeInstanceOf(VGMWriteDataCommand);
  expect(parseVGMCommand([0x56, 0, 0], 0)).toBeInstanceOf(VGMWriteDataCommand);
  expect(parseVGMCommand([0x61, 0x44, 0xac], 0)).toBeInstanceOf(VGMWaitWordCommand);

  expect(parseVGMCommand([0x90, 0x00, 0x00, 0x00, 0x00], 0)).toBeInstanceOf(VGMSetupStreamCommand);
  expect(parseVGMCommand([0x91, 0x00, 0x00, 0x00, 0x00], 0)).toBeInstanceOf(VGMSetStreamDataCommand);
  expect(parseVGMCommand([0x92, 0x00, 0x00, 0x00, 0x00, 0x00], 0)).toBeInstanceOf(VGMSetStreamFrequencyCommand);
  expect(parseVGMCommand([0x93, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 0)).toBeInstanceOf(
    VGMStartStreamCommand,
  );
  expect(parseVGMCommand([0x94, 0x00], 0)).toBeInstanceOf(VGMStopStreamCommand);
  expect(parseVGMCommand([0x95, 0x00, 0x00, 0x00, 0x00], 0)).toBeInstanceOf(VGMStartStreamFastCommand);
  expect(parseVGMCommand([0x68, 0x66, 0x20, 0x56, 0x34, 0x12, 0x56, 0x34, 0x12, 0x56, 0x34, 0x12], 0)).toBeInstanceOf(
    VGMPCMRAMWriteCommand,
  );
  expect(parseVGMCommand([0x67, 0x66, 0x20, 0x05, 0x00, 0x00, 0x00, 1, 2, 3, 4, 5], 0)).toBeInstanceOf(
    VGMDataBlockCommand,
  );
  expect(parseVGMCommand([0xe0, 0x78, 0x56, 0x34, 0x12], 0)).toBeInstanceOf(VGMSeekPCMCommand);
  expect(parseVGMCommand([0x82], 0)).toBeInstanceOf(VGMWrite2ACommand);
  expect(parseVGMCommand([0x66], 0)).toBeInstanceOf(VGMEndCommand);
});
