type Pointer = number;
type PtrString = Pointer;
type PtrAVFormatContext = Pointer;
type PtrAVInputFormat = Pointer;
type PtrAVDictionary = Pointer;
type AVERROR = number;

export interface AVInputFormat {
  ptr: PtrAVInputFormat;
  name: string;
}

export interface AVFormatContext {
  ptr: PtrAVFormatContext;
  iformat: AVInputFormat;
  duration: number;
  bit_rate: number;
}

export interface FS {
  writeFile(path: string, data: Uint8Array | string): void;
}

export interface Libav {
  FS: FS;
  NULL: number;
  stringToPtr: PtrString;
  avformat_alloc_context(): AVFormatContext;
  avformat_open_input(
    ctx: AVFormatContext,
    url: string,
    fmt: PtrAVInputFormat,
    options: PtrAVDictionary
  ): AVERROR;
}

export function createLibav(): Promise<Libav>;
