// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
  let HEAPF64: any;
  let FS_createPath: any;
  function FS_createDataFile(
    parent: any,
    name: any,
    fileData: any,
    canRead: any,
    canWrite: any,
    canOwn: any
  ): void;
  function FS_createPreloadedFile(
    parent: any,
    name: any,
    url: any,
    canRead: any,
    canWrite: any,
    onload: any,
    onerror: any,
    dontCreateFile: any,
    canOwn: any,
    preFinish: any
  ): void;
  function FS_unlink(path: any): any;
  let FS_createLazyFile: any;
  let FS_createDevice: any;
  let addRunDependency: any;
  let removeRunDependency: any;
}
interface WasmModule {
  __ZN7WorldJS3DioEN10emscripten3valEid(
    _0: number,
    _1: number,
    _2: number,
    _3: number
  ): void;
  __ZN7WorldJS7HarvestEN10emscripten3valEid(
    _0: number,
    _1: number,
    _2: number,
    _3: number
  ): void;
  __ZN7WorldJS10CheapTrickEN10emscripten3valES1_S1_i(
    _0: number,
    _1: number,
    _2: number,
    _3: number,
    _4: number
  ): void;
  __ZN7WorldJS3D4CEN10emscripten3valES1_S1_ii(
    _0: number,
    _1: number,
    _2: number,
    _3: number,
    _4: number,
    _5: number
  ): void;
  __ZN7WorldJS9SynthesisEN10emscripten3valERKS1_S3_iiS3_(
    _0: number,
    _1: number,
    _2: number,
    _3: number,
    _4: number,
    _5: number,
    _6: number
  ): void;
  __ZN7WorldJS18DisplayInformationEiii(
    _0: number,
    _1: number,
    _2: number
  ): void;
  __ZN13WorldNativeIO18DisplayInformationEiii(
    _0: number,
    _1: number,
    _2: number
  ): void;
  __ZN7WorldJS14GetInformationEiii(
    _0: number,
    _1: number,
    _2: number,
    _3: number
  ): void;
  __ZN13WorldNativeIO14GetInformationEiii(
    _0: number,
    _1: number,
    _2: number,
    _3: number
  ): void;
  __ZN7WorldJS7WavReadERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE(
    _0: number,
    _1: number
  ): void;
  __ZN13WorldNativeIO10WavRead_JSERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE(
    _0: number,
    _1: number
  ): void;
  __ZN7WorldJS8WavWriteEN10emscripten3valEiRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE(
    _0: number,
    _1: number,
    _2: number,
    _3: number
  ): void;
  __ZN13WorldNativeIO11WavWrite_JSEN10emscripten3valEiRKNSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE(
    _0: number,
    _1: number,
    _2: number,
    _3: number
  ): void;
  __ZN7WorldJS21DisplayInformationValEN10emscripten3valE(_0: number): void;
  __ZN14WorldJSWrapper21DisplayInformationValEN10emscripten3valE(
    _0: number
  ): void;
  __ZN7WorldJS17GetInformationValERKN10emscripten3valE(
    _0: number,
    _1: number
  ): void;
  __ZN14WorldJSWrapper17GetInformationValERKN10emscripten3valE(
    _0: number,
    _1: number
  ): void;
  __ZN7WorldJS9Wav2WorldERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE(
    _0: number,
    _1: number
  ): void;
  __ZN14WorldJSWrapper7W2WorldERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE(
    _0: number,
    _1: number
  ): void;
}

type EmbindString =
  | ArrayBuffer
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  | string;

type WavObject = {
  fs: number;
  nbit: number;
  x: Float64Array;
  x_length: number;
};

type F0EstimationResult = { f0: Float64Array; time_axis: Float64Array };

type SpectralEnvelopeEstimationResult = {
  fft_size: number;
  spectral: Float64Array[];
};

type AperiodicityEstimationResult = { aperiodicity: Float64Array[] };

export interface WorldJS {
  delete(): void;
}

interface EmbindModule {
  WorldJS: {
    new (): WorldJS;

    DisplayInformation(fs: number, nbit: number, x_length: number): void;

    WavRead(filename: EmbindString): WavObject;

    GetInformation(fs: number, nbit: number, x_length: number): string;

    WavWrite(y: Float64Array, fs: number, filename: EmbindString): number;

    Dio(x: Float64Array, fs: number, frame_period: number): F0EstimationResult;

    Harvest(
      x: Float64Array,
      fs: number,
      frame_period: number
    ): F0EstimationResult;

    CheapTrick(
      x: Float64Array,
      f0: Float64Array,
      time_axis: Float64Array,
      fs: number
    ): SpectralEnvelopeEstimationResult;

    D4C(
      x: Float64Array,
      f0: Float64Array,
      time_axis: Float64Array,
      fft_size: number,
      fs: number
    ): AperiodicityEstimationResult;

    Synthesis(
      f0: Float64Array,
      spectral: Float64Array[],
      aperiodicity: Float64Array[],
      fft_size: number,
      fs: number,
      frame_period: number
    ): Float64Array;

    DisplayInformationVal(x: WavObject): void;

    GetInformationVal(x: WavObject): string;

    Wav2World(
      filename: EmbindString
    ): WavObject &
      F0EstimationResult &
      SpectralEnvelopeEstimationResult &
      AperiodicityEstimationResult;
  };
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory(
  options?: unknown
): Promise<MainModule>;
