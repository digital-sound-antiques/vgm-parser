import { ChipName, VGMObject } from "./vgm_object";
import { buildVGMData } from "./builder";

export type VGMCommandObject = {
  cmd: number;
  size: number;
  chip?: ChipName;
  index?: number;
  type?: number;
  port?: number | null;
  addr?: number | null;
  data?: number;
  blockType?: number;
  blockSize?: number;
  blockData?: Uint8Array;
  readOffset?: number;
  writeOffset?: number;
  writeSize?: number;
  count?: number;
  streamId?: number;
  offset?: number;
  channel?: number;
  dataBankId?: number;
  stepBase?: number;
  stepSize?: number;
  frequency?: number;
  lengthMode?: number;
  dataLength?: number;
  blockId?: number;
  flags?: number;
};

export function blockTypeToChipName(blockType: number): ChipName {
  switch (blockType) {
    case 0x00:
    case 0x40:
      return "ym2612";
    case 0x01:
    case 0x41:
      return "rf5c68";
    case 0x02:
    case 0x42:
      return "rf5c164";
    case 0x03:
    case 0x43:
      return "pwm";
    case 0x04:
    case 0x44:
      return "okim6258";
    case 0x05:
    case 0x45:
      return "huc6280";
    case 0x06:
    case 0x46:
      return "scsp";
    case 0x07:
    case 0x47:
      return "nesApu";
    case 0x80:
      return "segaPcm";
    case 0x81:
      return "ym2608";
    case 0x82:
      return "ym2610";
    case 0x83:
      return "ym2610";
    case 0x84:
      return "ymf278b";
    case 0x85:
      return "ymf271";
    case 0x86:
      return "ymz280b";
    case 0x87:
      return "ymf278b";
    case 0x88:
      return "y8950";
    case 0x89:
      return "multiPcm";
    case 0x8a:
      return "upd7759";
    case 0x8b:
      return "okim6295";
    case 0x8c:
      return "k054539";
    case 0x8d:
      return "c140";
    case 0x8e:
      return "k053260";
    case 0x8f:
      return "qsound";
    case 0x90:
      return "es5506";
    case 0x91:
      return "x1_010";
    case 0x92:
      return "c352";
    case 0x93:
      return "ga20";
    case 0xc0:
      return "rf5c68";
    case 0xc1:
      return "rf5c164";
    case 0xc2:
      return "nesApu";
    case 0xe0:
      return "scsp";
    case 0xe1:
      return "es5503";
    default:
      return "unknown";
  }
}

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
  abstract clone(): VGMCommand;
  abstract copy(arg: Object): VGMCommand;
  toJSON() {
    return this.toObject();
  }
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

  copy(arg: { blockType?: number; blockSize?: number; blockData?: Uint8Array }): VGMDataBlockCommand {
    return new VGMDataBlockCommand({
      blockType: arg.blockType != null ? arg.blockType : this.blockType,
      blockSize: arg.blockSize != null ? arg.blockSize : this.blockSize,
      blockData: arg.blockData != null ? arg.blockData.slice(0) : this.blockData.slice(0)
    });
  }

  clone(): VGMDataBlockCommand {
    return this.copy({});
  }

  get chip(): ChipName {
    return blockTypeToChipName(this.blockType);
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
      chip: this.chip,
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

  copy(arg: Object): VGMEndCommand {
    return new VGMEndCommand();
  }

  clone(): VGMEndCommand {
    return this.copy({});
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

export abstract class VGMWaitCommand extends VGMCommand {
  count: number;
  constructor(cmd: number, count: number) {
    super(cmd);
    if (cmd == 0x61) {
      this.count = count;
    } else if (cmd == 0x62) {
      this.count = 735;
    } else if (cmd == 0x63) {
      this.count = 882;
    } else if (0x70 <= cmd && cmd <= 0x7f) {
      this.count = (cmd & 15) + 1;
    } else {
      throw new Error(`0x${cmd.toString(16)} is not a VGMWaitCommand.`);
    }
    if (this.count !== count) {
      throw new Error(
        `Count ${count} is given for command 0x${cmd.toString(16)} but the count should be ${this.count}.`
      );
    }
  }
  get size(): number {
    return this.cmd === 0x61 ? 3 : 1;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = this.cmd;
    if (this.cmd === 0x61) {
      setUint16LE(res, 1, this.count);
    }
    return res;
  }
  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      count: this.count
    };
  }
}

export class VGMWaitWordCommand extends VGMWaitCommand {
  constructor(arg: { count: number }) {
    super(0x61, arg.count);
    if (arg.count < 0 || 65535 < arg.count) {
      throw new Error(`Count overflow: ${arg.count}`);
    }
  }
  copy(arg: { count?: number }) {
    return new VGMWaitWordCommand({ count: arg.count != null ? arg.count : this.count });
  }
  clone(): VGMWaitWordCommand {
    return this.copy({});
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMWaitWordCommand | null {
    const cmd = buf[offset];
    if (cmd === 0x61) {
      const nnnn = getUint16LE(buf, offset + 1);
      return new VGMWaitWordCommand({ count: nnnn });
    }
    return null;
  }
  static fromObject(obj: VGMCommandObject): VGMWaitWordCommand | null {
    if (obj.cmd === 0x61) {
      if (obj.count == null) {
        throw new Error(`Can't create VGMWaitCommand: obj.count is missing.`);
      }
      return new VGMWaitWordCommand({ count: obj.count });
    }
    return null;
  }
}

export class VGMWaitNibbleCommand extends VGMWaitCommand {
  constructor(arg: { count: number }) {
    super(0x70 | ((arg.count - 1) & 15), arg.count);
    if (arg.count < 1 || 16 < arg.count) {
      throw new Error(`Invalid count: ${arg.count}`);
    }
  }
  copy(arg: { count?: number }) {
    return new VGMWaitNibbleCommand({ count: arg.count != null ? arg.count : this.count });
  }
  clone(): VGMWaitNibbleCommand {
    return this.copy({});
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMWaitNibbleCommand | null {
    const cmd = buf[offset];
    if (0x70 <= cmd && cmd <= 0x7f) {
      return new VGMWaitNibbleCommand({ count: (cmd & 15) + 1 });
    }
    return null;
  }
  static fromObject(obj: VGMCommandObject): VGMWaitNibbleCommand | null {
    if (0x70 <= obj.cmd && obj.cmd <= 0x7f) {
      return new VGMWaitNibbleCommand({ count: (obj.cmd & 15) + 1 });
    }
    return null;
  }
}

export class VGMWait735Command extends VGMWaitCommand {
  constructor() {
    super(0x62, 735);
  }
  copy(arg: {}): VGMWait735Command {
    return new VGMWait735Command();
  }
  clone(): VGMWait735Command {
    return this.copy({});
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMWait735Command | null {
    const cmd = buf[offset];
    if (cmd === 0x62) {
      return new VGMWait735Command();
    }
    return null;
  }
  static fromObject(obj: VGMCommandObject): VGMWait735Command | null {
    if (obj.cmd === 0x62) {
      return new VGMWait735Command();
    }
    return null;
  }
}

export class VGMWait882Command extends VGMWaitCommand {
  constructor() {
    super(0x63, 882);
  }
  copy(arg: {}): VGMWait882Command {
    return new VGMWait882Command();
  }
  clone(): VGMWait882Command {
    return this.copy({});
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMWait882Command | null {
    const cmd = buf[offset];
    if (cmd === 0x63) {
      return new VGMWait882Command();
    }
    return null;
  }
  static fromObject(obj: VGMCommandObject): VGMWait882Command | null {
    if (obj.cmd === 0x63) {
      return new VGMWait882Command();
    }
    return null;
  }
}

export class VGMWrite2ACommand extends VGMCommand {
  constructor(arg: { count: number }) {
    super(0x80 | (arg.count & 15));
    if (arg.count < 0 || 15 < arg.count) {
      throw new Error(`Invalid count ${arg.count} for VGMWrite2ACommand.`);
    }
  }

  copy(arg: { count?: number }): VGMWrite2ACommand {
    return new VGMWrite2ACommand({ count: arg.count != null ? arg.count : this.count });
  }

  clone(): VGMWrite2ACommand {
    return this.copy({});
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
      return new VGMWrite2ACommand({ count: cmd & 15 });
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
      return new VGMWrite2ACommand({ count: obj.cmd & 15 });
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

  copy(arg: {
    blockType?: number;
    readOffset?: number;
    writeOffset?: number;
    writeSize?: number;
  }): VGMPCMRAMWriteCommand {
    return new VGMPCMRAMWriteCommand({
      blockType: arg.blockType != null ? arg.blockType : this.blockType,
      readOffset: arg.readOffset != null ? arg.readOffset : this.readOffset,
      writeOffset: arg.writeOffset != null ? arg.writeOffset : this.writeOffset,
      writeSize: arg.writeSize != null ? arg.writeSize : this.writeSize
    });
  }

  clone(): VGMPCMRAMWriteCommand {
    return this.copy({});
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
  port: number;
  addr: number;
  data: number;
  size: number;
  constructor(arg: { cmd: number; index?: number; port?: number; addr?: number; data: number }) {
    super(arg.cmd);
    this.chip = commandToChipName(arg.cmd);
    this.index = arg.index || 0;
    this.port = arg.port || 0;
    this.addr = arg.addr || 0;
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

  copy(arg: { cmd?: number; index?: number; port?: number; addr?: number; data?: number }): VGMWriteDataCommand {
    return new VGMWriteDataCommand({
      cmd: arg.cmd != null ? arg.cmd : this.cmd,
      index: arg.index != null ? arg.index : this.index,
      port: arg.port != null ? arg.port : this.port,
      addr: arg.addr != null ? arg.addr : this.addr,
      data: arg.data != null ? arg.data : this.data
    });
  }

  clone(): VGMWriteDataCommand {
    return this.copy({});
  }

  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = this.cmd;
    if ((0x30 <= this.cmd && this.cmd <= 0x3f) || this.cmd === 0x4f || this.cmd === 0x50) {
      res[1] = this.data;
      return res;
    } else if ((0x51 <= this.cmd && this.cmd <= 0x5f) || (0xa0 <= this.cmd && this.cmd <= 0xbf)) {
      res[1] = this.addr;
      res[2] = this.data;
      return res;
    } else if (0xc0 <= this.cmd && this.cmd <= 0xc2) {
      setUint16LE(res, 1, this.addr | this.index ? 0x8000 : 0);
      res[3] = this.data;
      return res;
    } else if (0xc3 === this.cmd) {
      res[1] = this.addr | this.index ? 0x80 : 0;
      setUint16LE(res, 2, this.data);
      return res;
    } else if (0xc4 === this.cmd) {
      setUint16BE(res, 1, this.data);
      res[3] = this.addr;
      return res;
    } else if (0xc5 <= this.cmd && this.cmd <= 0xc8) {
      setUint16BE(res, 1, this.addr | this.index ? 0x8000 : 0);
      res[3] = this.data;
      return res;
    } else if (0xd0 <= this.cmd && this.cmd <= 0xd2) {
      res[1] = this.port | this.index ? 0x80 : 0;
      res[2] = this.addr;
      res[3] = this.data;
      return res;
    } else if (0xd3 <= this.cmd && this.cmd <= 0xd5) {
      setUint16BE(res, 1, this.addr | this.index ? 0x8000 : 0);
      res[3] = this.data;
      return res;
    } else if (0xd6 === this.cmd) {
      res[1] = this.addr | this.index ? 0x80 : 0;
      setUint16BE(res, 2, this.data);
      return res;
    } else if (0xe1 === this.cmd) {
      setUint16BE(res, 1, this.addr | this.index ? 0x8000 : 0);
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
    if (0x30 <= cmd && cmd <= 0x3f) {
      // 0x30: 2nd SN76489, 0x31-0x3e: Reserved, 0x3f: 2nd GG Sterao
      return new VGMWriteDataCommand({ cmd, index: 1, data: buf[offset + 1] });
    } else if (cmd === 0x4f) {
      // 1st GG Stereo
      return new VGMWriteDataCommand({ cmd, index: 0, data: buf[offset + 1] });
    } else if (cmd === 0x50) {
      // 1st SN76489
      return new VGMWriteDataCommand({ cmd, index: 0, data: buf[offset + 1] });
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
      return new VGMWriteDataCommand({ cmd, index, addr: addr & 0x7f, data: buf[offset + 2] });
    } else if (0xc0 <= cmd && cmd <= 0xc2) {
      const addr = getUint16LE(buf, offset + 1);
      const index = addr & 0x8000 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, addr: addr & 0x7fff, data: buf[offset + 3] });
    } else if (0xc3 === cmd) {
      const addr = buf[offset + 1];
      const index = addr & 0x80 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, addr: addr & 0x7f, data: getUint16LE(buf, offset + 2) });
    } else if (0xc4 === cmd) {
      return new VGMWriteDataCommand({ cmd, index: 0, addr: buf[3], data: getUint16BE(buf, offset + 1) });
    } else if (0xc5 <= cmd && cmd <= 0xc8) {
      const addr = getUint16BE(buf, offset + 1);
      const index = addr & 0x8000 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, addr: addr & 0x7fff, data: buf[offset + 3] });
    } else if (0xd0 <= cmd && cmd <= 0xd2) {
      const port = buf[offset + 1] & 0x7f;
      const index = buf[offset + 1] & 0x80 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, port, addr: buf[offset + 2], data: buf[offset + 3] });
    } else if (0xd3 <= cmd && cmd <= 0xd5) {
      const addr = getUint16BE(buf, offset + 1);
      const index = addr & 0x8000 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, addr: addr & 0x7fff, data: buf[offset + 3] });
    } else if (cmd === 0xd6) {
      const addr = buf[offset + 1];
      const index = addr & 0x80 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, addr: addr & 0x7f, data: getUint16BE(buf, offset + 3) });
    } else if (cmd === 0xe1) {
      const addr = getUint16BE(buf, offset + 1);
      const index = addr & 0x8000 ? 1 : 0;
      return new VGMWriteDataCommand({ cmd, index, addr: addr & 0x7fff, data: getUint16BE(buf, offset + 3) });
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

export abstract class VGMStreamCommand extends VGMCommand {
  streamId: number;
  constructor(cmd: number, streamId: number) {
    super(cmd);
    this.streamId = streamId;
  }
}

export class VGMSetupStreamCommand extends VGMStreamCommand {
  type: number;
  port: number;
  channel: number;
  constructor(arg: { streamId: number; type: number; port: number; channel: number }) {
    super(0x90, arg.streamId);
    this.type = arg.type;
    this.port = arg.port;
    this.channel = arg.channel;
  }

  copy(arg: { streamId?: number; type?: number; port?: number; channel?: number }): VGMSetupStreamCommand {
    return new VGMSetupStreamCommand({
      streamId: arg.streamId != null ? arg.streamId : this.streamId,
      type: arg.type != null ? arg.type : this.type,
      port: arg.port != null ? arg.port : this.port,
      channel: arg.channel != null ? arg.channel : this.channel
    });
  }

  clone(): VGMSetupStreamCommand {
    return this.copy({});
  }

  get size(): number {
    return 5;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = 0x90;
    res[1] = this.streamId;
    res[2] = this.type;
    res[3] = this.port;
    res[4] = this.channel;
    return res;
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMSetupStreamCommand | null {
    const cmd = buf[offset];
    if (cmd === 0x90) {
      return new VGMSetupStreamCommand({
        streamId: buf[offset + 1],
        type: buf[offset + 2],
        port: buf[offset + 3],
        channel: buf[offset + 4]
      });
    }
    return null;
  }
  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      streamId: this.streamId,
      type: this.type,
      port: this.port,
      channel: this.channel
    };
  }
  static fromObject(obj: VGMCommandObject): VGMSetupStreamCommand | null {
    const cmd = obj.cmd;
    if (cmd === 0x90) {
      if (obj.streamId == null || obj.type == null || obj.port == null || obj.channel == null) {
        throw new Error(`Can't create VGMSetupStreamCommand: required parameter is missing.`);
      }
      return new VGMSetupStreamCommand(obj as any);
    }
    return null;
  }
}

export class VGMSetStreamDataCommand extends VGMStreamCommand {
  dataBankId: number;
  stepSize: number;
  stepBase: number;
  constructor(arg: { streamId: number; dataBankId: number; stepSize: number; stepBase: number }) {
    super(0x91, arg.streamId);
    this.dataBankId = arg.dataBankId;
    this.stepSize = arg.stepSize;
    this.stepBase = arg.stepBase;
  }

  copy(arg: { streamId?: number; dataBankId?: number; stepSize?: number; stepBase?: number }): VGMSetStreamDataCommand {
    return new VGMSetStreamDataCommand({
      streamId: arg.streamId != null ? arg.streamId : this.streamId,
      dataBankId: arg.dataBankId != null ? arg.dataBankId : this.dataBankId,
      stepSize: arg.stepSize != null ? arg.stepSize : this.stepSize,
      stepBase: arg.stepBase != null ? arg.stepBase : this.stepBase
    });
  }

  clone(): VGMSetStreamDataCommand {
    return this.copy({});
  }

  get size(): number {
    return 5;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = 0x91;
    res[1] = this.streamId;
    res[2] = this.dataBankId;
    res[3] = this.stepSize;
    res[4] = this.stepBase;
    return res;
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMSetStreamDataCommand | null {
    const cmd = buf[offset];
    if (cmd === 0x91) {
      return new VGMSetStreamDataCommand({
        streamId: buf[offset + 1],
        dataBankId: buf[offset + 2],
        stepSize: buf[offset + 3],
        stepBase: buf[offset + 4]
      });
    }
    return null;
  }
  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      streamId: this.streamId,
      dataBankId: this.dataBankId,
      stepBase: this.stepBase,
      stepSize: this.stepSize
    };
  }
  static fromObject(obj: VGMCommandObject): VGMSetStreamDataCommand | null {
    const cmd = obj.cmd;
    if (cmd === 0x91) {
      if (obj.streamId == null || obj.dataBankId == null || obj.stepBase == null || obj.stepSize == null) {
        throw new Error(`Can't create VGMSetStreamDataCommand: required parameter is missing.`);
      }
      return new VGMSetStreamDataCommand(obj as any);
    }
    return null;
  }
}

export class VGMSetStreamFrequencyCommand extends VGMStreamCommand {
  frequency: number;
  constructor(arg: { streamId: number; frequency: number }) {
    super(0x92, arg.streamId);
    this.frequency = arg.frequency;
  }
  copy(arg: { streamId?: number; frequency?: number }): VGMSetStreamFrequencyCommand {
    return new VGMSetStreamFrequencyCommand({
      streamId: arg.streamId != null ? arg.streamId : this.streamId,
      frequency: arg.frequency != null ? arg.frequency : this.frequency
    });
  }
  clone(): VGMSetStreamFrequencyCommand {
    return this.copy({});
  }
  get size(): number {
    return 6;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = 0x92;
    res[1] = this.streamId;
    setUint32LE(res, 2, this.frequency);
    return res;
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMSetStreamFrequencyCommand | null {
    const cmd = buf[offset];
    if (cmd === 0x92) {
      return new VGMSetStreamFrequencyCommand({
        streamId: buf[offset + 1],
        frequency: getUint32LE(buf, offset + 2)
      });
    }
    return null;
  }
  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      streamId: this.streamId,
      frequency: this.frequency
    };
  }
  static fromObject(obj: VGMCommandObject): VGMSetStreamFrequencyCommand | null {
    const cmd = obj.cmd;
    if (cmd === 0x92) {
      if (obj.streamId == null || obj.frequency == null) {
        throw new Error(`Can't create VGMSetStreamFrequencyCommand: required parameter is missing.`);
      }
      return new VGMSetStreamFrequencyCommand(obj as any);
    }
    return null;
  }
}

export class VGMStartStreamCommand extends VGMStreamCommand {
  offset: number;
  lengthMode: number;
  dataLength: number;
  constructor(arg: { streamId: number; offset: number; lengthMode: number; dataLength: number }) {
    super(0x93, arg.streamId);
    this.offset = arg.offset;
    this.lengthMode = arg.lengthMode;
    this.dataLength = arg.dataLength;
  }
  copy(arg: { streamId?: number; offset?: number; lengthMode?: number; dataLength?: number }): VGMStartStreamCommand {
    return new VGMStartStreamCommand({
      streamId: arg.streamId != null ? arg.streamId : this.streamId,
      offset: arg.offset != null ? arg.offset : this.offset,
      lengthMode: arg.lengthMode != null ? arg.lengthMode : this.lengthMode,
      dataLength: arg.dataLength != null ? arg.dataLength : this.dataLength
    });
  }
  clone(): VGMStartStreamCommand {
    return this.copy({});
  }
  get size(): number {
    return 11;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = 0x93;
    res[1] = this.streamId;
    setUint32LE(res, 2, this.offset);
    res[6] = this.lengthMode;
    setUint32LE(res, 7, this.dataLength);
    return res;
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMStartStreamCommand | null {
    const cmd = buf[offset];
    if (cmd === 0x93) {
      return new VGMStartStreamCommand({
        streamId: buf[offset + 1],
        offset: getUint32LE(buf, offset + 2),
        lengthMode: buf[offset + 6],
        dataLength: getUint32LE(buf, offset + 7)
      });
    }
    return null;
  }
  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      streamId: this.streamId,
      offset: this.offset,
      lengthMode: this.lengthMode,
      dataLength: this.dataLength
    };
  }
  static fromObject(obj: VGMCommandObject): VGMStartStreamCommand | null {
    const cmd = obj.cmd;
    if (cmd === 0x93) {
      if (obj.streamId == null || obj.offset == null || obj.lengthMode == null || obj.dataLength == null) {
        throw new Error(`Can't create VGMStartStreamCommand: required parameter is missing.`);
      }
      return new VGMStartStreamCommand(obj as any);
    }
    return null;
  }
}

export class VGMStopStreamCommand extends VGMStreamCommand {
  constructor(arg: { streamId: number }) {
    super(0x94, arg.streamId);
  }
  copy(arg: { streamId?: number }): VGMStopStreamCommand {
    return new VGMStopStreamCommand({
      streamId: arg.streamId != null ? arg.streamId : this.streamId
    });
  }
  clone(): VGMStopStreamCommand {
    return this.copy({});
  }
  get size(): number {
    return 2;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = 0x94;
    res[1] = this.streamId;
    return res;
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMStopStreamCommand | null {
    const cmd = buf[offset];
    if (cmd === 0x94) {
      return new VGMStopStreamCommand({ streamId: buf[offset + 1] });
    }
    return null;
  }
  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      streamId: this.streamId
    };
  }
  static fromObject(obj: VGMCommandObject): VGMStopStreamCommand | null {
    const cmd = obj.cmd;
    if (cmd === 0x91) {
      if (obj.streamId == null) {
        throw new Error(`Can't create VGMStopStreamCommand: required parameter is missing.`);
      }
      return new VGMStopStreamCommand(obj as any);
    }
    return null;
  }
}

export class VGMStartStreamFastCommand extends VGMStreamCommand {
  blockId: number;
  flags: number;
  constructor(arg: { streamId: number; blockId: number; flags: number }) {
    super(0x95, arg.streamId);
    this.blockId = arg.blockId;
    this.flags = arg.flags;
  }
  copy(arg: { streamId?: number; blockId?: number; flags?: number }): VGMStartStreamFastCommand {
    return new VGMStartStreamFastCommand({
      streamId: arg.streamId != null ? arg.streamId : this.streamId,
      blockId: arg.blockId != null ? arg.blockId : this.blockId,
      flags: arg.flags != null ? arg.flags : this.flags
    });
  }
  clone(): VGMStartStreamFastCommand {
    return this.copy({});
  }
  get size(): number {
    return 5;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = 0x95;
    res[1] = this.streamId;
    setUint16LE(res, 2, this.blockId);
    res[4] = this.flags;
    return res;
  }
  static parse(buf: ArrayLike<number>, offset: number = 0): VGMStartStreamFastCommand | null {
    const cmd = buf[offset];
    if (cmd === 0x95) {
      return new VGMStartStreamFastCommand({
        streamId: buf[offset + 1],
        blockId: getUint16LE(buf, offset + 2),
        flags: buf[offset + 4]
      });
    }
    return null;
  }
  toObject(): VGMCommandObject {
    return {
      cmd: this.cmd,
      size: this.size,
      streamId: this.streamId,
      blockId: this.blockId,
      flags: this.flags
    };
  }
  static fromObject(obj: VGMCommandObject): VGMStartStreamFastCommand | null {
    const cmd = obj.cmd;
    if (cmd === 0x95) {
      if (obj.streamId == null || obj.blockId == null || obj.flags == null) {
        throw new Error(`Can't create VGMStartStreamFastCommand: required parameter is missing.`);
      }
      return new VGMStartStreamFastCommand(obj as any);
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
  copy(arg: { offset?: number }): VGMSeekPCMCommand {
    return new VGMSeekPCMCommand({ offset: arg.offset != null ? arg.offset : this.offset });
  }
  clone(): VGMSeekPCMCommand {
    return this.copy({});
  }
  get size(): number {
    return 5;
  }
  toUint8Array(): Uint8Array {
    const res = new Uint8Array(this.size);
    res[0] = 0xe0;
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
    VGMWaitNibbleCommand.parse(buf, offset) ||
    VGMWaitWordCommand.parse(buf, offset) ||
    VGMWait735Command.parse(buf, offset) ||
    VGMWait882Command.parse(buf, offset) ||
    VGMSeekPCMCommand.parse(buf, offset) ||
    VGMDataBlockCommand.parse(buf, offset) ||
    VGMPCMRAMWriteCommand.parse(buf, offset) ||
    VGMSetupStreamCommand.parse(buf, offset) ||
    VGMSetStreamDataCommand.parse(buf, offset) ||
    VGMSetStreamFrequencyCommand.parse(buf, offset) ||
    VGMStartStreamCommand.parse(buf, offset) ||
    VGMStopStreamCommand.parse(buf, offset) ||
    VGMStartStreamFastCommand.parse(buf, offset) ||
    VGMEndCommand.parse(buf, offset);
  if (result) {
    return result;
  }
  if (buf instanceof ArrayBuffer) {
    throw new Error("Parse Error:: The buffer should not be an ArrayBuffer.");
  }
  if (offset < buf.length) {
    throw new Error(`Parse Error:: 0x${buf[offset].toString(16)}`);
  }
  throw new Error(`Parse Error:: offset is out of range.`);
}

export function fromVGMCommandObject(obj: VGMCommandObject): VGMCommand {
  const result =
    VGMWrite2ACommand.fromObject(obj) ||
    VGMWriteDataCommand.fromObject(obj) ||
    VGMWaitNibbleCommand.fromObject(obj) ||
    VGMWaitWordCommand.fromObject(obj) ||
    VGMWait735Command.fromObject(obj) ||
    VGMWait882Command.fromObject(obj) ||
    VGMSeekPCMCommand.fromObject(obj) ||
    VGMDataBlockCommand.fromObject(obj) ||
    VGMPCMRAMWriteCommand.fromObject(obj) ||
    VGMSetupStreamCommand.fromObject(obj) ||
    VGMSetStreamDataCommand.fromObject(obj) ||
    VGMSetStreamFrequencyCommand.fromObject(obj) ||
    VGMStartStreamCommand.fromObject(obj) ||
    VGMStopStreamCommand.fromObject(obj) ||
    VGMStartStreamFastCommand.fromObject(obj) ||
    VGMEndCommand.fromObject(obj);
  if (result) {
    return result;
  }
  throw new Error(`Unsupported command: 0x${obj.cmd.toString(16)}`);
}

export class VGMDataStream {
  commands: Array<VGMCommand>;
  byteLength: number = 0;
  totalSamples: number = 0;
  loopSamples: number = 0;
  loopIndexOffset: number = 0;
  loopByteOffset: number = 0;
  private _loop: boolean = false;

  constructor(commands: Array<VGMCommand> = []) {
    this.commands = commands;
  }

  clone(): VGMDataStream {
    const res = new VGMDataStream(this.commands.map(e => e.clone()));
    res.byteLength = this.byteLength;
    res.totalSamples = this.totalSamples;
    res.loopSamples = this.loopSamples;
    res.loopIndexOffset = this.loopIndexOffset;
    res.loopByteOffset = this.loopByteOffset;
    return res;
  }

  clear() {
    this.commands = [];
    this.totalSamples = 0;
    this.loopSamples = 0;
    this.loopIndexOffset = 0;
    this.byteLength = 0;
    this.loopByteOffset = 0;
    this._loop = false;
  }

  get length(): number {
    return this.commands.length;
  }

  push(cmd: VGMCommand) {
    if (cmd instanceof VGMWaitCommand || cmd instanceof VGMWrite2ACommand) {
      this.totalSamples += cmd.count;
      if (this._loop) {
        this.loopSamples += cmd.count;
      }
    }
    this.commands.push(cmd);
    this.byteLength += cmd.size;
  }

  markLoopPoint() {
    this._loop = true;
    this.loopIndexOffset = this.commands.length;
    this.loopByteOffset = this.byteLength;
    this.loopSamples = 0;
  }

  static parse(vgm: VGMObject): VGMDataStream {
    const data = new Uint8Array(vgm.data);
    const res = new VGMDataStream();
    let rp = 0;
    while (rp < data.byteLength) {
      if (vgm.offsets.data + rp === vgm.offsets.loop) {
        res.markLoopPoint();
      }
      const cmd = parseVGMCommand(data, rp);
      if (cmd == null) break;
      res.push(cmd);
      rp += cmd.size;
      if (cmd instanceof VGMEndCommand) break;
    }
    return res;
  }

  build(): ArrayBuffer {
    return buildVGMData(this.commands);
  }

  toJSON() {
    const { commands, loopSamples, loopIndexOffset, loopByteOffset, totalSamples, byteLength } = this;
    return {
      byteLength,
      loopSamples,
      totalSamples,
      loopIndexOffset,
      loopByteOffset,
      commands
    };
  }
}
