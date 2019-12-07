export type ChipName =
  | "sn76489"
  | "gameGearStereo"
  | "ym2413"
  | "ym2612"
  | "ym2151"
  | "segaPcm"
  | "rf5c68"
  | "ym2203"
  | "ym2608"
  | "ym2610"
  | "ym3812"
  | "ym3526"
  | "y8950"
  | "ymf262"
  | "ymf278b"
  | "ymf271"
  | "ymz280b"
  | "rf5c164"
  | "pwm"
  | "ay8910"
  | "gameBoyDmg"
  | "nesApu"
  | "multiPcm"
  | "upd7759"
  | "okim6258"
  | "okim6295"
  | "k051649"
  | "k054539"
  | "huc6280"
  | "c140"
  | "k053260"
  | "pokey"
  | "qsound"
  | "scsp"
  | "wonderSwan"
  | "vsu"
  | "saa1099"
  | "es5503"
  | "es5506"
  | "x1_010"
  | "c352"
  | "ga20";

export type ChipTypeObject = {
  value: number;
  name: string;
};

export type ChipClockObject = {
  clock: number;
  dual: boolean;
};

export type ChipsObject = {
  sn76489?: ChipClockObject & {
    feedback: number;
    shiftRegisterWidth: number;
    flags: number;
  };
  gameGearStereo?: null /* dummy */;
  ym2413?: ChipClockObject;
  ym2612?: ChipClockObject & { chipType: ChipTypeObject };
  ym2151?: ChipClockObject & { chipType: ChipTypeObject };
  segaPcm?: ChipClockObject & { interfaceRegister: number };
  rf5c68?: ChipClockObject;
  ym2203?: ChipClockObject & { ssgFlags: number };
  ym2608?: ChipClockObject & { ssgFlags: number };
  ym2610?: ChipClockObject & { chipType: ChipTypeObject };
  ym3812?: ChipClockObject;
  ym3526?: ChipClockObject;
  y8950?: ChipClockObject;
  ymf262?: ChipClockObject;
  ymf278b?: ChipClockObject;
  ymf271?: ChipClockObject;
  ymz280b?: ChipClockObject;
  rf5c164?: ChipClockObject;
  pwm?: ChipClockObject;
  ay8910?: ChipClockObject & {
    chipType: ChipTypeObject;
    flags: number;
  };
  gameBoyDmg?: ChipClockObject;
  nesApu?: ChipClockObject;
  multiPcm?: ChipClockObject;
  upd7759?: ChipClockObject;
  okim6258?: ChipClockObject & { flags: number };
  okim6295?: ChipClockObject;
  k051649?: ChipClockObject;
  k054539?: ChipClockObject & { flags: number };
  huc6280?: ChipClockObject;
  c140?: ChipClockObject & { chipType: ChipTypeObject };
  k053260?: ChipClockObject;
  pokey?: ChipClockObject;
  qsound?: ChipClockObject;
  scsp?: ChipClockObject;
  wonderSwan?: ChipClockObject;
  vsu?: ChipClockObject;
  saa1099?: ChipClockObject;
  es5503?: ChipClockObject & { numberOfChannels: number };
  es5506?: ChipClockObject & { chipType: ChipTypeObject; numberOfChannels: number };
  x1_010?: ChipClockObject;
  c352?: ChipClockObject & { clockDivider: number };
  ga20?: ChipClockObject;
};

export function deepCloneChipsObject(chips: ChipsObject) {
  return JSON.parse(JSON.stringify(chips));
}

export type GD3TagObject = {
  version: number;
  size: number;
  trackTitle: string;
  gameName: string;
  system: string;
  composer: string;
  releaseDate: string;
  vgmBy: string;
  notes: string;
  japanese: {
    trackTitle: string;
    gameName: string;
    system: string;
    composer: string;
  };
};

export function createEmptyGD3TagObject(): GD3TagObject {
  return {
    version: 0,
    size: 0,
    trackTitle: "",
    gameName: "",
    system: "",
    composer: "",
    releaseDate: "",
    vgmBy: "",
    notes: "",
    japanese: {
      trackTitle: "",
      gameName: "",
      system: "",
      composer: ""
    }
  };
}

export function deepCloneGD3TagObject(arg: GD3TagObject): GD3TagObject {
  return { ...arg };
}

export type VersionObject = {
  /** raw version code (ex. 0x0170) */
  code: number;
  /** major major version number in string (ex. "1"). */
  major: string;
  /** minor version number in 2 digit string (ex. "70").*/
  minor: string;
};

export type OffsetsObject = {
  /** offset to end of file, relative from the top of the vgm file. */
  eof: number;
  /** offset to gd3 tag, relative from the top of the vgm file. 0 if no gd3 tag is present. */
  gd3: number;
  /** offset to loop point, relative from the top of the vgm file. 0 if no loop is present. */
  loop: number;
  /** offset to VGM data stream, relative from the top of the vgm file. */
  data: number;
  /** offset to extra header, relative from the top of the vgm file. 0 if no extra header is present. */
  extraHeader: number;
};

export type SamplesObject = {
  /** Total of all wait values in the file. */
  total: number;
  /** Total of all wait values between the loop point and the end of the file, or 0 if there is no loop. */
  loop: number;
};

export type VGMObject = {
  version: VersionObject;
  offsets: OffsetsObject;
  samples: SamplesObject;
  rate: number;
  chips: ChipsObject;
  loopModifier: number;
  loopBase: number;
  volumeModifier: number;
  data: ArrayBuffer;
  usedChips: ChipName[];
  gd3tag: GD3TagObject;
};

export function deepCloneVGMObject(arg: VGMObject): VGMObject {
  return {
    version: { ...arg.version },
    offsets: { ...arg.offsets },
    samples: { ...arg.samples },
    rate: arg.rate,
    chips: { ...arg.chips },
    loopModifier: arg.loopModifier,
    loopBase: arg.loopBase,
    volumeModifier: arg.volumeModifier,
    data: arg.data.slice(0),
    usedChips: arg.usedChips,
    gd3tag: deepCloneGD3TagObject(arg.gd3tag)
  };
}

export function createEmptyVGMObject(): VGMObject {
  return {
    version: {
      code: 0x170,
      major: "1",
      minor: "70"
    },
    offsets: {
      eof: 0,
      data: 0,
      loop: 0,
      gd3: 0,
      extraHeader: 0
    },
    samples: {
      loop: 0,
      total: 0
    },
    chips: {},
    rate: 0,
    loopModifier: 0,
    loopBase: 0,
    volumeModifier: 0,
    data: new ArrayBuffer(0),
    usedChips: [],
    gd3tag: createEmptyGD3TagObject()
  };
}
