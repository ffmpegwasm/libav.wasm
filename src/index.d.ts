type Pointer = number;
type PtrString = Pointer;
type PtrAVFormatContext = Pointer;
type PtrPtrAVFormatContext = Pointer;
type PtrAVInputFormat = Pointer;
type PtrAVDictionary = Pointer;
type PtrPtrAVDictionary = Pointer;
type AVERROR = number;

export interface AVInputFormat {
  contructor(ptr: PtrAVInputFormat): void;
  ptr: PtrAVInputFormat;
  name: string;
}

export interface AVFormatContext {
  contructor(ptr: PtrAVFormatContext): void;
  ptr: PtrAVFormatContext;
  iformat: AVInputFormat;
  duration: number;
  bit_rate: number;
}

export interface FS {
  writeFile(path: string, data: Uint8Array | string): void;
  unlink(path: string): void;
}

export interface Libav {
  FS: FS;
  NULL: number;
  ref(p: Pointer): Pointer;
  stringToPtr: PtrString;
  avformat_alloc_context(): PtrAVFormatContext;
  avformat_free_context(ctx: PtrAVFormatContext): void;
  avformat_open_input(
    ctx: PtrPtrAVFormatContext,
    url: string,
    fmt: PtrAVInputFormat,
    options: PtrPtrAVDictionary
  ): AVERROR;
}

export function createLibav(): Promise<Libav>;
