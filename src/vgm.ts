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
  createEmptyVGMObject
} from "./vgm_object";
import { parseVGM } from "./parser";

export class VGM implements VGMObject {
  private _obj: VGMObject;

  get version() {
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
  get rate() {
    return this._obj.rate;
  }
  set rate(value) {
    this._obj.rate = value;
  }
  get chips(): ChipsObject {
    return this._obj.chips;
  }
  set chips(value: ChipsObject) {
    this._obj.chips = deepCloneChipsObject(value);
  }
  get loopModifier() {
    return this._obj.loopModifier;
  }
  set loopModifier(value) {
    this._obj.loopModifier = value;
  }
  get loopBase() {
    return this._obj.loopBase;
  }
  set loopBase(value) {
    this._obj.loopBase = value;
  }
  get volumeModifier() {
    return this._obj.volumeModifier;
  }
  set volumeModifier(value) {
    this._obj.volumeModifier = value;
  }
  get data() {
    return this._obj.data;
  }
  set data(value) {
    this._obj.data = value.slice(0);
  }
  get usedChips(): ChipName[] {
    return this._obj.usedChips;
  }
  set usedChips(value: ChipName[]) {
    this._obj.usedChips = value.slice(0);
  }
  get gd3tag(): GD3TagObject {
    return this._obj.gd3tag;
  }
  set gd3tag(value: GD3TagObject) {
    this._obj.gd3tag = deepCloneGD3TagObject(value);
  }

  constructor(arg: VGMObject | null) {
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
  clone() {
    return new VGM(deepCloneVGMObject(this._obj));
  }

  /**
   * parse VGM binary and return VGM instance.
   * @param data ArrayBuffer which contains VGM binary.
   */
  static parse(data: ArrayBuffer): VGM {
    return new VGM(parseVGM(data));
  }
}

/**
 * convert samples to time, minute-seconds representation.
 * @param samples number of samples
 * @param sampleRate base sample rate
 */
export function formatMinSec(samples: number, sampleRate: number = 44100) {
  let millis = Math.round((samples / sampleRate) * 1000);
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis - minutes * 60000) / 1000);
  const decimillis = Math.round((millis - seconds * 1000) / 10);
  return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}.${("0" + decimillis).slice(-2)}`;
}
