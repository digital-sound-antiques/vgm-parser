import {
  VGMObject,
  ChipName,
  VersionObject,
  OffsetsObject,
  SamplesObject,
  ChipsObject,
  deepCloneChipsObject,
  deepCloneGD3TagObject,
  deepCloneVGMObject,
  GD3TagObject,
  createEmptyVGMObject,
  calcGD3TagBodySize
} from "./vgm_object";
import { parseVGM } from "./parser";
import { buildVGM } from "./builder";
import { VGMDataStream } from "./vgm_command";

export class VGM implements VGMObject {
  private _obj: VGMObject;

  private _updateEOFOffset() {
    if (this._obj.gd3tag) {
      this._obj.offsets.gd3 = this._obj.offsets.data + this._obj.data.byteLength;
      this._obj.offsets.eof = this._obj.offsets.gd3 + 12 + calcGD3TagBodySize(this._obj.gd3tag);
    } else {
      this._obj.offsets.gd3 = 0;
      this._obj.offsets.eof = this._obj.offsets.data + this._obj.data.byteLength;
    }
  }

  get version(): VersionObject {
    return this._obj.version;
  }
  set version(value: VersionObject) {
    this._obj.version = { ...value };
  }
  get offsets(): OffsetsObject {
    return this._obj.offsets;
  }
  set offsets(value: OffsetsObject) {
    this._obj.offsets = { ...value };
  }
  get samples(): SamplesObject {
    return this._obj.samples;
  }
  set samples(value: SamplesObject) {
    this._obj.samples = { ...value };
  }
  get rate(): number {
    return this._obj.rate;
  }
  set rate(value: number) {
    this._obj.rate = value;
  }
  get chips(): ChipsObject {
    return this._obj.chips;
  }
  set chips(value: ChipsObject) {
    this._obj.chips = deepCloneChipsObject(value);
  }
  get loopModifier(): number {
    return this._obj.loopModifier;
  }
  set loopModifier(value: number) {
    this._obj.loopModifier = value;
  }
  get loopBase(): number {
    return this._obj.loopBase;
  }
  set loopBase(value: number) {
    this._obj.loopBase = value;
  }
  get volumeModifier(): number {
    return this._obj.volumeModifier;
  }
  set volumeModifier(value: number) {
    this._obj.volumeModifier = value;
  }
  get data(): ArrayBuffer {
    return this._obj.data;
  }
  /** this directly replace data buffer. To keep consistency, use setDataStream() or setData() instead. */
  set data(value: ArrayBuffer) {
    this._obj.data = value.slice(0);
  }
  get usedChips(): ChipName[] {
    return this._obj.usedChips;
  }
  set usedChips(value: ChipName[]) {
    this._obj.usedChips = value.slice(0);
  }
  get gd3tag(): GD3TagObject | undefined {
    return this._obj.gd3tag;
  }
  set gd3tag(value: GD3TagObject | undefined) {
    this._obj.gd3tag = deepCloneGD3TagObject(value);
    this._updateEOFOffset();
  }

  constructor(arg?: VGMObject | null) {
    if (arg) {
      this._obj = deepCloneVGMObject(arg);
    } else {
      this._obj = createEmptyVGMObject();
    }
  }

  /** Convert VGM instance to pure [[VGMObject]]. */
  toObject(): VGMObject {
    return deepCloneVGMObject(this._obj);
  }

  /** deep clone this instance. */
  clone(): VGM {
    return new VGM(deepCloneVGMObject(this._obj));
  }

  /**
   * parse VGM binary and return VGM instance.
   * @param data ArrayBuffer which contains VGM binary.
   */
  static parse(data: ArrayBuffer): VGM {
    return new VGM(parseVGM(data));
  }

  build(): ArrayBuffer {
    return buildVGM(this);
  }

  /**
   * Access VGM data stream as a list of VGM commands.
   * Note: This method always parses internal VGM data buffer.
   */
  getDataStream(): VGMDataStream {
    return VGMDataStream.parse(this._obj);
  }

  /**
   * set VGM data by VGMDataStream object
   */
  setDataStream(stream: VGMDataStream) {
    this.setData(stream.build(), stream.totalSamples, stream.loopSamples, stream.loopByteOffset);
  }

  /**
   * set VGM data with ArrayBuffer
   * @param data ArrayBuffer which contains VGM data stream binary
   * @param totalSamples Total samples
   * @param loopSamples Loop samples. 0 if no loop
   * @param loopByteOffset  Loop offset in byte. Relative from top of [data].
   */
  setData(data: ArrayBuffer, totalSamples: number, loopSamples: number, loopByteOffset: number) {
    this._obj.data = data.slice(0);
    this._obj.offsets.loop = 0 < loopSamples ? this._obj.offsets.data + loopByteOffset : 0;
    this._obj.samples = {
      total: totalSamples,
      loop: loopSamples
    };
    this._updateEOFOffset();
  }

  toJSON() {
    return { ...this._obj, data: this.getDataStream() };
  }
}

/**
 * convert samples to time, minute-seconds representation.
 * @param samples number of samples
 * @param sampleRate base sample rate
 */
export function formatMinSec(samples: number, sampleRate: number = 44100): string {
  let millis = Math.round((samples / sampleRate) * 1000);
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis - minutes * 60000) / 1000);
  const decimillis = Math.round((millis - seconds * 1000) / 10);
  return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}.${("0" + decimillis).slice(-2)}`;
}
