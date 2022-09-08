import { IAVFormatContenxt } from "../../libav-type/index.d";
import { getLibav } from "./libav";

export function openMedia(filename: string): IAVFormatContenxt | null {
  const {
    NULL,
    // @ts-ignore
    _avformat_alloc_context,
    // @ts-ignore
    _avformat_open_input,
    // @ts-ignore
    _avformat_find_stream_info,
    // @ts-ignore
    ref,
    // @ts-ignore
    deref,
    // @ts-ignore
    stringToPtr,
    // @ts-ignore
    _free,
    // @ts-ignore
    AVFormatContext,
  } = getLibav();

  const avfc = new AVFormatContext(_avformat_alloc_context());
  if (avfc.ptr === NULL) {
    console.error("failed to alloc memory for format");
    return null;
  }

  const ptr = ref(avfc.ptr);
  const err = _avformat_open_input(ptr, stringToPtr(filename), NULL, NULL);
  avfc.ptr = deref(ptr);
  _free(ptr);
  if (err) {
    console.error("failed to open input file ", filename);
    return null;
  }

  if (_avformat_find_stream_info(avfc.ptr, NULL) < 0) {
    console.error("failed to get stream info");
    return null;
  }

  return avfc;
}
