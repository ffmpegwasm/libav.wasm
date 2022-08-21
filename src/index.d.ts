type Pointer = number;
type PtrString = Pointer;
type PtrAVFormatContext = Pointer;
type PtrPtrAVFormatContext = Pointer;
type PtrAVInputFormat = Pointer;
type PtrAVDictionary = Pointer;
type PtrPtrAVDictionary = Pointer;
type AVERROR = number;

export interface AVInputFormat {
  new (ptr: AVInputFormat): AVInputFormat;
  ptr: PtrAVInputFormat;
  name: string;
}

export interface AVFormatContext {
  new (ptr: PtrAVFormatContext): AVFormatContext;
  ptr: PtrAVFormatContext;
  url: string;
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
  ref<TPointer>(p: TPointer): TPointer;
  deref<TPointer>(p: TPointer): TPointer;
  stringToPtr(str: string): PtrString;
  AVFormatContext: AVFormatContext;
  _avformat_alloc_context(): PtrAVFormatContext;
  _avformat_free_context(ctx: PtrAVFormatContext): void;
  _avformat_open_input(
    ctx: PtrPtrAVFormatContext,
    url: PtrString,
    fmt: PtrAVInputFormat,
    options: PtrPtrAVDictionary
  ): AVERROR;
}

export function createLibav(): Promise<Libav>;
