import {
  VGMObject,
  GD3TagObject,
  ChipClockObject,
  ExtraHeaderObject,
  ExtraChipClockObject,
  ExtraChipVolumeObject
} from "./vgm_object";
import { VGMCommand } from "./vgm_command";

export class AutoResizeBuffer {
  _buf: ArrayBuffer;
  _view: DataView;
  _written: number;
  constructor() {
    this._buf = new ArrayBuffer(256);
    this._view = new DataView(this._buf);
    this._written = 0;
  }

  _expandBuffer() {
    const newSize = this._buf.byteLength * 2;
    const newBuf = new ArrayBuffer(newSize);
    new Uint8Array(newBuf).set(new Uint8Array(this._buf));
    this._buf = newBuf;
    this._view = new DataView(this._buf);
  }

  toArrayBuffer(): ArrayBuffer {
    return this._buf.slice(0, this._written);
  }

  setUint8(byteOffset: number, value: number) {
    if (this._view.byteLength < byteOffset + 1) {
      this._expandBuffer();
    }
    this._view.setUint8(byteOffset, value);
    this._written = Math.max(this._written, byteOffset + 1);
  }

  setInt8(byteOffset: number, value: number) {
    if (this._view.byteLength < byteOffset + 1) {
      this._expandBuffer();
    }
    this._view.setInt8(byteOffset, value);
    this._written = Math.max(this._written, byteOffset + 1);
  }

  setUint16LE(byteOffset: number, value: number) {
    if (this._view.byteLength < byteOffset + 2) {
      this._expandBuffer();
    }
    this._view.setUint16(byteOffset, value, true);
    this._written = Math.max(this._written, byteOffset + 2);
  }

  setInt16LE(byteOffset: number, value: number) {
    if (this._view.byteLength < byteOffset + 2) {
      this._expandBuffer();
    }
    this._view.setInt16(byteOffset, value, true);
    this._written = Math.max(this._written, byteOffset + 2);
  }

  setUint32LE(byteOffset: number, value: number) {
    if (this._view.byteLength < byteOffset + 4) {
      this._expandBuffer();
    }
    this._view.setUint32(byteOffset, value, true);
    this._written = Math.max(this._written, byteOffset + 4);
  }

  setInt32LE(byteOffset: number, value: number) {
    if (this._view.byteLength < byteOffset + 4) {
      this._expandBuffer();
    }
    this._view.setInt32(byteOffset, value, true);
    this._written = Math.max(this._written, byteOffset + 4);
  }

  setData(byteOffset: number, data: Uint8Array) {
    while (this._view.byteLength < byteOffset + data.length) {
      this._expandBuffer();
    }
    for (let i = 0; i < data.length; i++) {
      this._view.setUint8(byteOffset + i, data[i]);
    }
    this._written = Math.max(this._written, byteOffset + data.length);
  }

  setText(byteOffset: number, text: string): number {
    while (this._view.byteLength < byteOffset + (text.length * 2 + 2)) {
      this._expandBuffer();
    }

    for (let i = 0; i < text.length; i++) {
      this.setUint16LE(byteOffset + i * 2, text.charCodeAt(i));
    }
    this.setUint16LE(byteOffset + text.length * 2, 0);
    return text.length * 2 + 2;
  }
}

function _makeClock(obj: ChipClockObject) {
  return obj.clock | (obj.dual ? 0x40000000 : 0);
}

function _writeVGMHeader(buf: AutoResizeBuffer, vgm: VGMObject): number {
  buf.setUint8(0x00, 0x56); // 'V'
  buf.setUint8(0x01, 0x67); // 'g'
  buf.setUint8(0x02, 0x6d); // 'm'
  buf.setUint8(0x03, 0x20); // ' '
  buf.setUint32LE(0x04, vgm.offsets.eof - 0x04);
  buf.setUint32LE(0x08, vgm.version.code);
  buf.setUint32LE(0x14, 0 < vgm.offsets.gd3 ? vgm.offsets.gd3 - 0x14 : 0);
  buf.setUint32LE(0x18, vgm.samples.total);
  buf.setUint32LE(0x1c, 0 < vgm.samples.loop ? vgm.offsets.loop - 0x1c : 0);
  buf.setUint32LE(0x20, vgm.samples.loop);
  buf.setUint32LE(0x34, vgm.offsets.data - 0x34);

  if (vgm.chips.sn76489) {
    buf.setUint32LE(0x0c, _makeClock(vgm.chips.sn76489) | (vgm.chips.sn76489.t6w28 ? 0x80000000 : 0));
  }
  if (vgm.chips.ym2413) {
    buf.setUint32LE(0x10, _makeClock(vgm.chips.ym2413));
  }

  if (0x101 <= vgm.version.code) {
    buf.setUint32LE(0x24, vgm.rate);
  }

  if (0x110 <= vgm.version.code) {
    if (vgm.chips.sn76489) {
      buf.setUint16LE(0x28, vgm.chips.sn76489.feedback || 0);
      buf.setUint8(0x2a, vgm.chips.sn76489.shiftRegisterWidth || 0);
    }
    if (vgm.chips.ym2612) {
      buf.setUint32LE(0x2c, _makeClock(vgm.chips.ym2612));
    }
    if (vgm.chips.ym2151) {
      buf.setUint32LE(0x30, _makeClock(vgm.chips.ym2151));
    }
  }

  if (0x150 <= vgm.version.code) {
    buf.setUint32LE(0x34, (vgm.offsets.data || 0x40) - 0x34);
  }

  if (0x151 <= vgm.version.code) {
    if (vgm.chips.sn76489) {
      buf.setUint8(0x2b, vgm.chips.sn76489.flags || 0);
    }

    if (vgm.chips.segaPcm) {
      buf.setUint32LE(0x38, _makeClock(vgm.chips.segaPcm));
      buf.setUint32LE(0x3c, vgm.chips.segaPcm.interfaceRegister || 0);
    }
    if (vgm.chips.rf5c68) {
      buf.setUint32LE(0x40, _makeClock(vgm.chips.rf5c68));
    }
    if (vgm.chips.ym2203) {
      buf.setUint32LE(0x44, _makeClock(vgm.chips.ym2203));
    }
    if (vgm.chips.ym2608) {
      buf.setUint32LE(0x48, _makeClock(vgm.chips.ym2608));
    }
    if (vgm.chips.ym2610) {
      const chipType = vgm.chips.ym2610.chipType || { value: 0 };
      buf.setUint32LE(0x4c, _makeClock(vgm.chips.ym2610) | (chipType.value ? 0x80000000 : 0));
    }
    if (vgm.chips.ym3812) {
      buf.setUint32LE(0x50, _makeClock(vgm.chips.ym3812));
    }
    if (vgm.chips.ym3526) {
      buf.setUint32LE(0x54, _makeClock(vgm.chips.ym3526));
    }
    if (vgm.chips.y8950) {
      buf.setUint32LE(0x58, _makeClock(vgm.chips.y8950));
    }
    if (vgm.chips.ymf262) {
      buf.setUint32LE(0x5c, _makeClock(vgm.chips.ymf262));
    }
    if (vgm.chips.ymf278b) {
      buf.setUint32LE(0x60, _makeClock(vgm.chips.ymf278b));
    }
    if (vgm.chips.ymf271) {
      buf.setUint32LE(0x64, _makeClock(vgm.chips.ymf271));
    }
    if (vgm.chips.ymz280b) {
      buf.setUint32LE(0x68, _makeClock(vgm.chips.ymz280b));
    }
    if (vgm.chips.rf5c164) {
      buf.setUint32LE(0x6c, _makeClock(vgm.chips.rf5c164));
    }
    if (vgm.chips.pwm) {
      buf.setUint32LE(0x70, _makeClock(vgm.chips.pwm));
    }
    if (vgm.chips.ay8910) {
      buf.setUint32LE(0x74, _makeClock(vgm.chips.ay8910));
      const chipType = vgm.chips.ay8910.chipType || { value: 0 };
      buf.setUint8(0x78, chipType.value);
      buf.setUint8(0x79, vgm.chips.ay8910.flags || 0);
    }
    if (vgm.chips.ym2203) {
      buf.setUint8(0x7a, vgm.chips.ym2203.ssgFlags || 0);
    }
    if (vgm.chips.ym2608) {
      buf.setUint8(0x7b, vgm.chips.ym2608.ssgFlags || 0);
    }

    buf.setUint8(0x7f, vgm.loopModifier);
  }

  if (0x160 <= vgm.version.code) {
    buf.setUint8(0x7c, vgm.volumeModifier);
    buf.setUint8(0x7e, vgm.loopBase);
  }

  if (0x161 <= vgm.version.code) {
    if (vgm.chips.gameBoyDmg) {
      buf.setUint32LE(0x80, _makeClock(vgm.chips.gameBoyDmg));
    }
    if (vgm.chips.nesApu) {
      buf.setUint32LE(0x84, _makeClock(vgm.chips.nesApu) | (vgm.chips.nesApu.fds ? 0x80000000 : 0));
    }
    if (vgm.chips.multiPcm) {
      buf.setUint32LE(0x88, _makeClock(vgm.chips.multiPcm));
    }
    if (vgm.chips.upd7759) {
      buf.setUint32LE(0x8c, _makeClock(vgm.chips.upd7759));
    }
    if (vgm.chips.okim6258) {
      buf.setUint32LE(0x90, _makeClock(vgm.chips.okim6258));
      buf.setUint8(0x94, vgm.chips.okim6258.flags || 0);
    }
    if (vgm.chips.k054539) {
      buf.setUint8(0x95, vgm.chips.k054539.flags || 0);
    }
    if (vgm.chips.c140) {
      const chipType = vgm.chips.c140.chipType || { value: 0 };
      buf.setUint8(0x96, chipType.value);
    }
    if (vgm.chips.okim6295) {
      buf.setUint32LE(0x98, _makeClock(vgm.chips.okim6295));
    }
    if (vgm.chips.k051649) {
      buf.setUint32LE(0x9c, _makeClock(vgm.chips.k051649));
    }
    if (vgm.chips.k054539) {
      buf.setUint32LE(0xa0, _makeClock(vgm.chips.k054539));
    }
    if (vgm.chips.huc6280) {
      buf.setUint32LE(0xa4, _makeClock(vgm.chips.huc6280));
    }
    if (vgm.chips.c140) {
      buf.setUint32LE(0xa8, _makeClock(vgm.chips.c140));
    }
    if (vgm.chips.k053260) {
      buf.setUint32LE(0xac, _makeClock(vgm.chips.k053260));
    }
    if (vgm.chips.pokey) {
      buf.setUint32LE(0x0b0, _makeClock(vgm.chips.pokey));
    }
    if (vgm.chips.qsound) {
      buf.setUint32LE(0xb4, _makeClock(vgm.chips.qsound));
    }
  }

  if (0x170 <= vgm.version.code) {
    buf.setUint32LE(0xbc, vgm.offsets.extraHeader ? vgm.offsets.extraHeader - 0xbc : 0);

    if (vgm.extraHeader) {
      _writeExtraHeader(buf, vgm.offsets.extraHeader, vgm.extraHeader);
    }
  }

  if (0x171 <= vgm.version.code) {
    if (vgm.chips.scsp) {
      buf.setUint32LE(0xb8, _makeClock(vgm.chips.scsp));
    }
    if (vgm.chips.wonderSwan) {
      buf.setUint32LE(0xc0, _makeClock(vgm.chips.wonderSwan));
    }
    if (vgm.chips.vsu) {
      buf.setUint32LE(0x0c4, _makeClock(vgm.chips.vsu));
    }
    if (vgm.chips.saa1099) {
      buf.setUint32LE(0xc8, _makeClock(vgm.chips.saa1099));
    }
    if (vgm.chips.es5503) {
      buf.setUint32LE(0xcc, _makeClock(vgm.chips.es5503));
    }
    if (vgm.chips.es5506) {
      const chipType = vgm.chips.es5506.chipType || { value: 0 };
      buf.setUint32LE(0xd0, _makeClock(vgm.chips.es5506) | (chipType.value ? 0x80000000 : 0));
    }
    if (vgm.chips.es5503) {
      buf.setUint8(0xd4, vgm.chips.es5503.numberOfChannels || 0);
    }
    if (vgm.chips.es5506) {
      buf.setUint8(0xd5, vgm.chips.es5506.numberOfChannels || 0);
    }
    if (vgm.chips.c352) {
      buf.setUint8(0xd6, vgm.chips.c352.clockDivider || 0);
    }
    if (vgm.chips.x1_010) {
      buf.setUint32LE(0xd8, _makeClock(vgm.chips.x1_010));
    }
    if (vgm.chips.c352) {
      buf.setUint32LE(0xdc, _makeClock(vgm.chips.c352));
    }
    if (vgm.chips.ga20) {
      buf.setUint32LE(0xe0, _makeClock(vgm.chips.ga20));
    }
    buf.setUint32LE(0xe4, 0);
  }

  return vgm.version.code <= 0x100 ? 0x40 : vgm.offsets.data || 0x100;
}

function _writeExtraChipClocks(buf: AutoResizeBuffer, byteOffset: number, clocks: Array<ExtraChipClockObject>): number {
  let wp = 0;
  buf.setUint8(byteOffset + wp, clocks.length);
  wp++;
  for (const e of clocks) {
    buf.setUint8(byteOffset + wp, e.chipId);
    wp++;
    buf.setUint32LE(byteOffset + wp, e.clock);
    wp += 4;
  }
  return wp;
}

function _writeExtraChipVolumes(
  buf: AutoResizeBuffer,
  byteOffset: number,
  volumes: Array<ExtraChipVolumeObject>
): number {
  let wp = 0;
  buf.setUint8(byteOffset + wp, volumes.length);
  wp++;
  for (const e of volumes) {
    buf.setUint8(byteOffset + wp, e.chipId | (e.paired ? 0x80 : 0));
    wp++;
    buf.setUint8(byteOffset + wp, e.flags);
    wp++;
    buf.setUint16LE(byteOffset + wp, e.volume | (e.absolute ? 0x8000 : 0));
    wp += 2;
  }
  return wp;
}

function _writeExtraHeader(buf: AutoResizeBuffer, byteOffset: number, header: ExtraHeaderObject): number {
  let headerSize = header.volumes ? 12 : 8;
  buf.setUint32LE(byteOffset, headerSize);
  let clockPartSize = 0;
  let volumePartSize = 0;
  if (header.clocks) {
    clockPartSize = _writeExtraChipClocks(buf, byteOffset + headerSize, header.clocks);
    buf.setUint32LE(byteOffset + 4, headerSize - 4);
  }
  if (header.volumes) {
    volumePartSize = _writeExtraChipVolumes(buf, byteOffset + headerSize + clockPartSize, header.volumes);
    buf.setUint32LE(byteOffset + 8, headerSize - 8 + clockPartSize);
  }
  return headerSize + clockPartSize + volumePartSize;
}

function _writeGD3Tag(buf: AutoResizeBuffer, byteOffset: number, gd3: GD3TagObject): number {
  buf.setUint32LE(byteOffset + 0, 0x20336447);
  buf.setUint32LE(byteOffset + 4, gd3.version || 0x100);
  let wp = byteOffset + 12;
  wp += buf.setText(wp, gd3.trackTitle);
  wp += buf.setText(wp, gd3.japanese.trackTitle);
  wp += buf.setText(wp, gd3.gameName);
  wp += buf.setText(wp, gd3.japanese.gameName);
  wp += buf.setText(wp, gd3.system);
  wp += buf.setText(wp, gd3.japanese.system);
  wp += buf.setText(wp, gd3.composer);
  wp += buf.setText(wp, gd3.japanese.composer);
  wp += buf.setText(wp, gd3.releaseDate);
  wp += buf.setText(wp, gd3.vgmBy);
  wp += buf.setText(wp, gd3.notes);
  const size = wp - (byteOffset + 12);
  buf.setUint32LE(byteOffset + 8, size);
  return wp;
}

export function buildVGMData(commands: Array<VGMCommand>): ArrayBuffer {
  const buf = new AutoResizeBuffer();
  let wp = 0;
  for (const cmd of commands) {
    buf.setData(wp, cmd.toUint8Array());
    wp += cmd.size;
  }
  return buf.toArrayBuffer();
}

export function buildVGM(vgm: VGMObject): ArrayBuffer {
  const buf = new AutoResizeBuffer();
  let wp = _writeVGMHeader(buf, vgm);
  buf.setData(wp, new Uint8Array(vgm.data));
  wp += vgm.data.byteLength;
  if (vgm.gd3tag) {
    _writeGD3Tag(buf, vgm.offsets.gd3 || wp, vgm.gd3tag);
  }
  return buf.toArrayBuffer();
}
