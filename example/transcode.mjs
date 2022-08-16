/**
 * @ref: https://github.com/leandromoreira/ffmpeg-libav-tutorial/blob/46e8aba7bf1bc337d9b665f3541449d45e9d4202/3_transcoding.c
 */

import { createLibav } from "../src/index.js";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { argv, exit } from "node:process";

// load libav module.
console.time("load-libav");
const {
  FS: { writeFile },
  ref,
  deref,
  NULL,
  stringToPtr,
  AVFormatContext,
  AVCodec,
  AVStream,
  AVCodecContext,
  __avmedia_type_video,
  __avmedia_type_audio,
  _avformat_alloc_context,
  _avformat_open_input,
  _avformat_free_context,
  _avformat_find_stream_info,
  _avcodec_find_decoder,
  _avcodec_alloc_context3,
  _avcodec_parameters_to_context,
  _avcodec_open2,
  _avformat_alloc_output_context2,
} = await createLibav();
console.timeEnd("load-libav");

const AVMEDIA_TYPE_VIDEO = __avmedia_type_video();
const AVMEDIA_TYPE_AUDIO = __avmedia_type_audio();

class StreamingContext {
  avfc = new AVFormatContext(NULL);
  video_avc = new AVCodec(NULL);
  audio_avc = new AVCodec(NULL);
  video_avs = new AVStream(NULL);
  audio_avs = new AVStream(NULL);
  video_avcc = new AVCodecContext(NULL);
  audio_avcc = new AVCodecContext(NULL);
  video_index = -1;
  audio_index = -1;
  filename = NULL;
}

const fill_stream_info = (avs, avc, avcc) => {
  avc.ptr = _avcodec_find_decoder(avs.codecpar.codec_id);
  if (!avc.ptr) {
    console.log("failed to find the codec");
    return -1;
  }

  avcc.ptr = _avcodec_alloc_context3(avc.ptr);
  if (!avcc.ptr) {
    console.log("failed to alloc memory for codec context");
    return -1;
  }

  if (_avcodec_parameters_to_context(avcc.ptr, avs.codecpar.ptr) < 0) {
    console.log("failed to fill codec context");
    return -1;
  }

  if (_avcodec_open2(avcc.ptr, avc.ptr, NULL) < 0) {
    console.log("failed to open codec");
    return -1;
  }

  return 0;
};

const open_media = (filename, avfc) => {
  avfc.ptr = _avformat_alloc_context();
  if (!avfc.ptr) {
    console.log("failed to alloc memory for format");
    return -1;
  }

  const ptr = ref(avfc.ptr);
  if (_avformat_open_input(ptr, stringToPtr(filename), NULL, NULL) !== 0) {
    console.log("failed to open input file ", filename);
    return -1;
  }
  avfc.ptr = deref(ptr);

  if (_avformat_find_stream_info(avfc.ptr, NULL) < 0) {
    console.log("failed to get stream info");
    return -1;
  }

  return 0;
};

const prepare_decoder = (sc) => {
  for (let i = 0; i < sc.avfc.nb_streams; i++) {
    const codec_type = sc.avfc.nth_stream(i).codecpar.codec_type;
    if (codec_type === AVMEDIA_TYPE_VIDEO) {
      sc.video_avs.ptr = sc.avfc.nth_stream(i).ptr;
      sc.video_index = i;
      if (fill_stream_info(sc.video_avs, sc.video_avc, sc.video_avcc))
        return -1;
    } else if (codec_type == AVMEDIA_TYPE_AUDIO) {
      sc.audio_avs = sc.avfc.nth_stream(i).ptr;
      sc.audio_index = i;
      if (fill_stream_info(sc.audio_avs, sc.audio_avc, sc.audio_avcc))
        return -1;
    } else {
      console.log("skipping streams other than audio and video");
    }
  }

  return 0;
};

const main = () => {
  const [, , iFilePath, oFilePath] = argv;

  if (!iFilePath || !oFilePath) {
    console.log("Usage: node transcode.js <IN_FILE_PATH> <OUT_FILE_PATH>");
    exit(1);
  }

  const iFileName = basename(iFilePath);
  const media = Uint8Array.from(readFileSync(iFilePath));

  writeFile(iFileName, media);

  const oFileName = basename(oFilePath);

  const decoder = new StreamingContext();
  decoder.filename = stringToPtr(iFileName);

  const encoder = new StreamingContext();
  encoder.filename = stringToPtr(oFileName);

  if (open_media(iFileName, decoder.avfc)) return -1;
  if (prepare_decoder(decoder)) return -1;

  const ptr = ref(encoder.avfc.ptr);
  _avformat_alloc_output_context2(ptr, NULL, NULL, encoder.filename);
  encoder.avfc.ptr = deref(ptr);
  if (!encoder.avfc.ptr) {
    console.log("could not allocate memory for output format");
    return -1;
  }

  _avformat_free_context(decoder.avfc);
  decoder.avfc = NULL;
};

main();
