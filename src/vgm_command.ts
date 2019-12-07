import { ChipName } from "./vgm_object";

export type VGMCommandObject = {
  cmd: number;
  size: number;
  chip?: ChipName;
  index?: number;
  port?: number | null;
  addr?: number | null;
  data?: number;
  blockType?: number;
  blockSize?: number;
  blockData?: Uint8Array;
  readOffset?: number;
  writeOffset?: number;
  writeSize?: number;
  streamId?: number;
  offset?: number;
  count?: number;
  channel?: number;
};

export function commandToChipName(cmd: number): ChipName {
  switch (cmd) {
    case 0x30:
    case 0x50:
      return "sn76489";
    case 0x3f:
    case 0x4f:
      return "gameGearStereo";
    case 0x51:
    case 0xa1:
      return "ym2413";
    case 0x52:
    case 0x53:
    case 0xa2:
    case 0xa3:
      return "ym2612";
    case 0x54:
    case 0xa4:
      return "ym2151";
    case 0x55:
    case 0xa5:
      return "ym2203";
    case 0x56:
    case 0x57:
    case 0xa6:
    case 0xa7:
      return "ym2608";
    case 0x58:
    case 0x59:
    case 0xa8:
    case 0xa9:
      return "ym2610";
    case 0x5a:
    case 0xaa:
      return "ym3812";
    case 0x5b:
    case 0xab:
      return "ym3526";
    case 0x5c:
    case 0xac:
      return "y8950";
    case 0x5d:
    case 0xad:
      return "ymz280b";
    case 0x5e:
    case 0x5f:
    case 0xae:
    case 0xaf:
      return "ymf262";
    case 0xa0:
      return "ay8910";
    case 0xb0:
      return "rf5c68";
    case 0xb1:
      return "rf5c164";
    case 0xb2:
      return "pwm";
    case 0xb3:
      return "gameBoyDmg";
    case 0xb4:
      return "nesApu";
    case 0xb5:
      return "multiPcm";
    case 0xb6:
      return "upd7759";
    case 0xb7:
      return "okim6258";
    case 0xb8:
      return "okim6295";
    case 0xb9:
      return "huc6280";
    case 0xba:
      return "k053260";
    case 0xbb:
      return "pokey";
    case 0xbc:
      return "wonderSwan";
    case 0xbd:
      return "saa1099";
    case 0xbe:
      return "es5506";
    case 0xbf:
      return "ga20";
    case 0xc0:
      return "segaPcm";
    case 0xc1:
      return "rf5c68";
    case 0xc2:
      return "rf5c164";
    case 0xc3:
      return "multiPcm";
    case 0xc4:
      return "qsound";
    case 0xc5:
      return "scsp";
    case 0xc6:
      return "wonderSwan";
    case 0xc7:
      return "vsu";
    case 0xc8:
      return "x1_010";
    case 0xd0:
      return "ymf278b";
    case 0xd1:
      return "ymf271";
    case 0xd2:
      return "k051649";
    case 0xd3:
      return "k054539";
    case 0xd4:
      return "c140";
    case 0xd5:
      return "es5503";
    case 0xd6:
      return "es5506";
    case 0xe1:
      return "c352";
    default:
      throw new Error("Unknown chip");
  }
}

function getUint16BE(buf: ArrayLike<number>, pos: number): number {
  return ((buf[pos] & 0xff) << 8) | (buf[pos + 1] & 0xff);
}
function setUint16BE(buf: Uint8Array, pos: number, data: number): void {
  buf[pos] = (data >> 8) & 0xff;
  buf[pos + 1] = data & 0xff;
}
function getUint16LE(buf: ArrayLike<number>, pos: number): number {
  return (buf[pos] & 0xff) | ((buf[pos + 1] & 0xff) << 8);
}
function setUint16LE(buf: Uint8Array, pos: number, data: number): void {
  buf[pos] = data & 0xff;
  buf[pos + 1] = (data >> 8) & 0xff;
}
function getUint24LE(buf: ArrayLike<number>, pos: number): number {
  return (buf[pos] & 0xff) | ((buf[pos + 1] & 0xff) << 8) | ((buf[pos + 2] & 0xff) << 16);
}
function setUint24LE(buf: Uint8Array, pos: number, data: number): void {
  buf[pos] = data & 0xff;
  buf[pos + 1] = (data >> 8) & 0xff;
  buf[pos + 2] = (data >> 16) & 0xff;
}
function getUint32LE(buf: ArrayLike<number>, pos: number): number {
  return (
    (buf[pos] & 0xff) | ((buf[pos + 1] & 0xff) << 8) | ((buf[pos + 2] & 0xff) << 16) | ((buf[pos + 3] & 0xff) << 24)
  );
}
function setUint32LE(buf: Uint8Array, pos: number, data: number): void {
  buf[pos] = data & 0xff;
  buf[pos + 1] = (data >> 8) & 0xff;
  buf[pos + 2] = (data >> 16) & 0xff;
  buf[pos + 3] = (data >> 24) & 0xff;
}

export abstract class VGMCommand implements VGMCommandObject {
  cmd: number;
  constructor(cmd: number) {
    this.cmd = cmd;
  }
  abstract get size(): number;
  abstract toUint8Array(): Uint8Array;
  abstract toObject(): VGMCommandObject;
}

export class VGMDataBlockCommand extends VGMCommand {
  blockType: number;
  blockSize: number;
  blockData: Uint8Array;

  constructor(arg: { blockType: number; blockSize: number; blockData: Uint8Array }) {
    super(0x67);
    this.blockType = arg.blockType;
    this.blockSize = arg.blockSize;
    this.blockData = arg.blockData;
  }

  get size(): number {
    return 7 + this.blockData.length;
  }

  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = 0x67;
    res[1] = 0x66;
    res[2] = this.blockType;
    setUint32LE(res, 3, this.blockSize);
    for (let i = 0; i < this.blockData.length; i++) {
      res[i + 7] = this.blockData[i];
    }
    return res;
  }

  static parse(buf: ArrayLike<number>, offset: number): VGMDataBlockCommand | null {
    if (buf[offset] === 0x67) {
      const blockType = buf[offset + 2];
      const blockSize = getUint32LE(buf, offset + 3);
      const blockData = new Uint8Array(blockSize);
      for (let i = 0; i < blockSize; i++) {
        blockData[i] = buf[offset + 7 + i];
      }
      return new VGMDataBlockCommand({ blockType, blockSize, blockData });
    }
    return null;
  }

  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      blockType: this.blockType,
      blockSize: this.blockSize,
      blockData: this.blockData.slice(0)
    };
  }

  static fromObject(obj: VGMCommandObject): VGMDataBlockCommand | null {
    if (obj.cmd === 0x67) {
      if (obj.blockType != null && obj.blockData != null && obj.blockSize != null) {
        return new VGMDataBlockCommand(obj as any);
      } else {
        throw new Error(`Can't create VGMDataBlockCommand: required parameter is missing.`);
      }
    }
    return null;
  }
}

export class VGMEndCommand extends VGMCommand {
  constructor() {
    super(0x66);
  }
  get size(): number {
    return 1;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(1);
    res[0] = 0x66;
    return res;
  }

  static parse(buf: ArrayLike<number>, offset: number = 0): VGMEndCommand | null {
    if (buf[offset] === 0x66) {
      return new VGMEndCommand();
    }
    return null;
  }

  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size
    };
  }

  static fromObject(obj: VGMCommandObject): VGMEndCommand | null {
    if (obj.cmd === 0x66) {
      return new VGMEndCommand();
    }
    return null;
  }
}

export class VGMWaitCommand extends VGMCommand {
  count: number;
  constructor(arg: { cmd: number; nnnn?: number }) {
    super(arg.cmd);
    if (arg.cmd === 0x61) {
      this.count = arg.nnnn!;
    } else if (arg.cmd === 0x62) {
      this.count = 735;
    } else if (arg.cmd === 0x63) {
      this.count = 882;
    } else if (0x70 <= arg.cmd && arg.cmd <= 0x7f) {
      this.count = (arg.cmd & 0xf) + 1;
    } else {
      throw new Error(`${this.cmd} is not a VGMWaitCommand.`);
    }
  }

  get size(): number {
    return this.cmd === 0x61 ? 3 : 1;
  }

  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = this.cmd;
    if (this.cmd === 0x61) {
      setUint16LE(res, 1, this.count - 1);
    }
    return res;
  }

  static parse(buf: ArrayLike<number>, offset: number = 0): VGMWaitCommand | null {
    const cmd = buf[offset];
    if (cmd === 0x61) {
      const nnnn = getUint16LE(buf, offset + 1);
      return new VGMWaitCommand({ cmd, nnnn });
    }
    if (cmd === 0x62 || cmd === 0x63 || (0x70 <= cmd && cmd <= 0x7f)) {
      return new VGMWaitCommand({ cmd });
    }
    return null;
  }

  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      count: this.count
    };
  }

  static fromObject(obj: VGMCommandObject): VGMWaitCommand | null {
    if (obj.cmd === 0x62 || obj.cmd === 0x63 || (0x70 <= obj.cmd && obj.cmd <= 0x7f)) {
      return new VGMWaitCommand(obj);
    }
    if (obj.cmd === 0x61) {
      if (obj.count == null) {
        throw new Error(`Can't create VGMWaitCommand: obj.count is missing.`);
      }
      return new VGMWaitCommand({ cmd: obj.cmd, nnnn: obj.count });
    }
    return null;
  }
}

export class VGMWrite2ACommand extends VGMCommand {
  constructor(arg: { cmd: number }) {
    super(arg.cmd);
  }
  get count(): number {
    return this.cmd & 0xf;
  }
  get size(): number {
    return 1;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = this.cmd;
    return res;
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMWrite2ACommand | null {
    const cmd = buf[offset];
    if (0x80 <= cmd && cmd <= 0x8f) {
      return new VGMWrite2ACommand({ cmd });
    }
    return null;
  }

  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      count: this.count
    };
  }

  static fromObject(obj: VGMCommandObject): VGMWrite2ACommand | null {
    if (0x80 <= obj.cmd && obj.cmd <= 0x8f) {
      return new VGMWrite2ACommand(obj);
    }
    return null;
  }
}

export class VGMPCMRAMWriteCommand extends VGMCommand {
  blockType: number;
  readOffset: number;
  writeOffset: number; /* RAM offset to write */
  writeSize: number;
  constructor(arg: { blockType: number; readOffset: number; writeOffset: number; writeSize: number }) {
    super(0x68);
    this.blockType = arg.blockType;
    this.readOffset = arg.readOffset;
    this.writeOffset = arg.writeOffset;
    this.writeSize = arg.writeSize;
  }
  get size(): number {
    return 12;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = this.cmd;
    res[1] = 0x66;
    res[2] = this.blockType;
    setUint24LE(res, 3, this.readOffset);
    setUint24LE(res, 6, this.writeOffset);
    setUint24LE(res, 9, this.writeSize);
    return res;
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMPCMRAMWriteCommand | null {
    const cmd = buf[offset];
    if (cmd === 0x68) {
      const blockType = buf[offset + 2];
      const readOffset = getUint24LE(buf, offset + 3);
      const writeOffset = getUint24LE(buf, offset + 6);
      const writeSize = getUint24LE(buf, offset + 9);
      return new VGMPCMRAMWriteCommand({ blockType, readOffset, writeOffset, writeSize });
    }
    return null;
  }

  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      blockType: this.blockType,
      readOffset: this.readOffset,
      writeOffset: this.writeOffset,
      writeSize: this.writeSize
    };
  }

  static fromObject(obj: VGMCommandObject): VGMPCMRAMWriteCommand | null {
    if (obj.cmd === 0x68) {
      if (obj.blockType == null || obj.readOffset == null || obj.writeOffset == null || obj.writeSize == null) {
        throw new Error(`Can't create VGMPCMRAMWriteCommand: required parameter is missing.`);
      }
      return new VGMPCMRAMWriteCommand(obj as any);
    }
    return null;
  }
}

export class VGMWriteDataCommand extends VGMCommand {
  chip: ChipName;
  index: number;
  port: number | null;
  addr: number | null;
  data: number;
  size: number;
  constructor(arg: { cmd: number; index: number; port: number | null; addr: number | null; data: number }) {
    super(arg.cmd);
    this.chip = commandToChipName(arg.cmd);
    this.index = arg.index;
    this.port = arg.port;
    this.addr = arg.addr;
    this.data = arg.data;
    if ((0x30 <= this.cmd && this.cmd <= 0x3f) || this.cmd === 0x4f || this.cmd === 0x50) {
      this.size = 2;
    } else if (0x40 <= this.cmd && this.cmd <= 0x4e) {
      this.size = 3;
    } else if (0x51 <= this.cmd && this.cmd <= 0x5f) {
      this.size = 3;
    } else if (0xa0 <= this.cmd && this.cmd <= 0xbf) {
      this.size = 3;
    } else if (0xc0 <= this.cmd && this.cmd <= 0xdf) {
      this.size = 4;
    } else if (0xe0 <= this.cmd && this.cmd <= 0xff) {
      this.size = 5;
    } else {
      throw new Error(`${this.cmd} is not a VGMWriteDataComand.`);
    }
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = this.cmd;
    if ((0x30 <= this.cmd && this.cmd <= 0x3f) || this.cmd === 0x4f || this.cmd === 0x50) {
      res[1] = this.data;
      return res;
    } else if ((0x51 <= this.cmd && this.cmd <= 0x5f) || (0xa0 <= this.cmd && this.cmd <= 0xbf)) {
      res[1] = this.addr!;
      res[2] = this.data;
      return res;
    } else if (0xc0 <= this.cmd && this.cmd <= 0xc2) {
      setUint16LE(res, 1, this.addr! | this.index ? 0x8000 : 0);
      res[3] = this.data;
      return res;
    } else if (0xc3 === this.cmd) {
      res[1] = this.addr! | this.index ? 0x80 : 0;
      setUint16LE(res, 2, this.data);
      return res;
    } else if (0xc4 === this.cmd) {
      setUint16BE(res, 1, this.data);
      res[3] = this.addr!;
      return res;
    } else if (0xc5 <= this.cmd && this.cmd <= 0xc8) {
      setUint16BE(res, 1, this.addr! | this.index ? 0x8000 : 0);
      res[3] = this.data;
      return res;
    } else if (0xd0 <= this.cmd && this.cmd <= 0xd2) {
      res[0] = this.port! | this.index ? 0x80 : 0;
      res[1] = this.addr!;
      res[2] = this.data;
      return res;
    } else if (0xd3 <= this.cmd && this.cmd <= 0xd5) {
      setUint16BE(res, 1, this.addr! | this.index ? 0x8000 : 0);
      res[3] = this.data;
      return res;
    } else if (0xd6 === this.cmd) {
      res[1] = this.addr! | this.index ? 0x80 : 0;
      setUint16BE(res, 2, this.data);
      return res;
    } else if (0xe1 === this.cmd) {
      setUint16BE(res, 1, this.addr! | this.index ? 0x8000 : 0);
      setUint16BE(res, 3, this.data);
      return res;
    } else {
      throw new Error(`${this.cmd} is not a VGMWriteDataCommand`);
    }
  }

  get chipName(): ChipName {
    return commandToChipName(this.cmd);
  }

  static parse(buf: ArrayLike<number>, offset: number = 0): VGMWriteDataCommand | null {
    const cmd = buf[offset + 0];
    if (cmd === 0x30) {
      // 2nd SN76489
      return new VGMWriteDataCommand({ cmd, index: 1, port: null, addr: null, data: buf[offset + 1] });
    } else if (cmd === 0x3f) {
      // 2nd GG Stereo
      return new VGMWriteDataCommand({ cmd, index: 1, port: null, addr: null, data: buf[offset + 1] });
    } else if (cmd === 0x4f) {
      // 1st GG Stereo
      return new VGMWriteDataCommand({ cmd, index: 0, port: null, addr: null, data: buf[offset + 1] });
    } else if (cmd === 0x50) {
      // 1st SN76489
      return new VGMWriteDataCommand({ cmd, index: 0, port: null, addr: null, data: buf[offset + 1] });
    } else if (cmd === 0xa0) {
      // AY-3-8910
      const addr = buf[offset + 1];
      const index = addr & 0x80 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, port: 0, addr: addr & 0x7f, data: buf[offset + 2] });
    } else if ((0x51 <= cmd && cmd <= 0x5f) || (0xa1 <= cmd && cmd <= 0xaf)) {
      const index = (cmd & 0xf0) === 0x50 ? 0 : 1;
      const port = 0 <= [0x3, 0x7, 0x9, 0xf].indexOf(cmd & 0x0f) ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, port, addr: buf[offset + 1], data: buf[offset + 2] });
    } else if (0xb0 <= cmd && cmd <= 0xbf) {
      const addr = buf[offset + 1];
      const index = addr & 0x80 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, port: null, addr: addr & 0x7f, data: buf[offset + 2] });
    } else if (0xc0 <= cmd && cmd <= 0xc2) {
      const addr = getUint16LE(buf, offset + 1);
      const index = addr & 0x8000 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, port: null, addr: addr & 0x7fff, data: buf[offset + 3] });
    } else if (0xc3 === cmd) {
      const addr = buf[offset + 1];
      const index = addr & 0x80 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, port: null, addr: addr & 0x7f, data: getUint16LE(buf, offset + 2) });
    } else if (0xc4 === cmd) {
      return new VGMWriteDataCommand({ cmd, index: 0, port: null, addr: buf[3], data: getUint16BE(buf, offset + 1) });
    } else if (0xc5 <= cmd && cmd <= 0xc8) {
      const addr = getUint16BE(buf, offset + 1);
      const index = addr & 0x8000 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, port: null, addr: addr & 0x7fff, data: buf[offset + 3] });
    } else if (0xd0 <= cmd && cmd <= 0xd2) {
      const port = buf[offset + 1] & 0x7f;
      const index = buf[offset + 1] & 0x80 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, port, addr: buf[offset + 2], data: buf[offset + 3] });
    } else if (0xd3 <= cmd && cmd <= 0xd5) {
      const addr = getUint16BE(buf, offset + 1);
      const index = addr & 0x8000 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, port: null, addr: addr & 0x7fff, data: buf[offset + 3] });
    } else if (cmd === 0xd6) {
      const addr = buf[offset + 1];
      const index = addr & 0x80 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, port: null, addr: addr & 0x7f, data: getUint16BE(buf, offset + 3) });
    } else if (cmd === 0xe1) {
      const addr = getUint16BE(buf, offset + 1);
      const index = addr & 0x8000 ? 1 : 0;
      return new VGMWriteDataCommand({
        cmd,
        index,
        port: null,
        addr: addr & 0x7fff,
        data: getUint16BE(buf, offset + 3)
      });
    }
    return null;
  }

  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      chip: this.chip,
      size: this.size,
      index: this.index,
      port: this.port,
      addr: this.addr,
      data: this.data
    };
  }

  static fromObject(obj: VGMCommandObject): VGMWriteDataCommand | null {
    const cmd = obj.cmd;
    if (
      cmd === 0x30 ||
      cmd === 0x3f ||
      cmd === 0x4f ||
      (0x50 <= cmd && cmd <= 0x5f) ||
      (0xa0 <= cmd && cmd <= 0xdf) ||
      cmd === 0xe0 ||
      cmd === 0xe1
    ) {
      return new VGMWriteDataCommand(obj as any);
    }
    return null;
  }
}

export class VGMSeekPCMCommand extends VGMCommand {
  offset: number;
  constructor(arg: { offset: number }) {
    super(0xe0);
    this.offset = arg.offset;
  }
  get size(): number {
    return 5;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    setUint32LE(res, 1, this.offset);
    return res;
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMSeekPCMCommand | null {
    const cmd = buf[offset];
    if (cmd === 0xe0) {
      return new VGMSeekPCMCommand({ offset: getUint32LE(buf, offset + 1) });
    }
    return null;
  }
  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      offset: this.offset
    };
  }

  static fromObject(obj: VGMCommandObject): VGMSeekPCMCommand | null {
    const cmd = obj.cmd;
    if (cmd === 0xe0) {
      if (obj.offset == null) {
        throw new Error(`Can't create VGMSeekPCMCommand: required parameter is missing.`);
      }
      return new VGMSeekPCMCommand(obj as any);
    }
    return null;
  }
}

export function parseVGMCommand(buf: ArrayLike<number>, offset: number): VGMCommand {
  const result =
    VGMWrite2ACommand.parse(buf, offset) ||
    VGMWriteDataCommand.parse(buf, offset) ||
    VGMWaitCommand.parse(buf, offset) ||
    VGMSeekPCMCommand.parse(buf, offset) ||
    VGMDataBlockCommand.parse(buf, offset) ||
    VGMPCMRAMWriteCommand.parse(buf, offset) ||
    VGMEndCommand.parse(buf, offset);
  if (result) {
    return result;
  }
  throw new Error(`Parse Error:: 0x${buf[offset].toString(16)}`);
}

export function fromVGMCommandObject(obj: VGMCommandObject): VGMCommand {
  const result =
    VGMWrite2ACommand.fromObject(obj) ||
    VGMWriteDataCommand.fromObject(obj) ||
    VGMWaitCommand.fromObject(obj) ||
    VGMSeekPCMCommand.fromObject(obj) ||
    VGMDataBlockCommand.fromObject(obj) ||
    VGMPCMRAMWriteCommand.fromObject(obj) ||
    VGMEndCommand.fromObject(obj);
  if (result) {
    return result;
  }
  throw new Error(`Unsupported command: 0x${obj.cmd.toString(16)}`);
}
