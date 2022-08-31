// Type definitions for libav-core 0.1
// Project: https://github.com/ffmpegwasm/libav.wasm
// Definitions by: Jerome Wu <https://github.com/jeromewu>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export type Pointer = number;
export type PtrAVFormatContext = Pointer;
export type PtrPtrAVFormatContext = Pointer;
export type PtrAVInputFormat = Pointer;
export type PtrAVDictionary = Pointer;
export type PtrPtrAVDictionary = Pointer;
export type PtrString = Pointer;
export type ErrorCode = number;
export type AVERROR = ErrorCode;

export class IBase {
  _ptr: Pointer;
  constructor(ptr: Pointer);
  get ptr(): Pointer;
  set ptr(ptr: Pointer);
}

export class IAVFormatContenxt extends IBase {}

export interface LibavCore {
  NULL: Pointer;
  ref: (ptr: Pointer) => Pointer;
  deref: (ptr: Pointer) => Pointer;
  stringToPtr: (str: string) => PtrString;
  AVFormatContext: typeof IAVFormatContenxt;
  _avformat_alloc_context: () => PtrAVFormatContext;
  _avformat_open_input: (
    avfc: PtrPtrAVFormatContext,
    filename: PtrString,
    fmt: PtrAVInputFormat,
    options: PtrPtrAVDictionary
  ) => AVERROR;
  _avformat_find_stream_info(
    avfc: PtrAVFormatContext,
    options: PtrPtrAVDictionary
  ): AVERROR;
  _free: (ptr: Pointer) => void;
}

declare function LibavCoreFactory(): Promise<LibavCore>;
export default LibavCoreFactory;
