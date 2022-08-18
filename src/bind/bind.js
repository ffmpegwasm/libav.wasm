/**
 * Constants
 */

Module["NULL"] = 0;
Module["SIZE_I32"] = Uint32Array.BYTES_PER_ELEMENT;

/**
 * Classes
 */

class Base {
  constructor(ptr) {
    this.ptr = ptr;
  }
}

class AVFormatContext extends Base {
  get url() {
    const { UTF8ToString, __avformat_context_url } = Module;
    return UTF8ToString(__avformat_context_url(this.ptr));
  }

  get iformat() {
    return new AVInputFormat(Module["__avformat_context_iformat"](this.ptr));
  }

  get oformat() {
    return new AVOutputFormat(Module["__avformat_context_oformat"](this.ptr));
  }

  get pb() {
    return new AVIOContext(Module["__avformat_context_pb"](this.ptr));
  }

  get duration() {
    return Module["__avformat_context_duration"](this.ptr);
  }

  get bit_rate() {
    return Module["__avformat_context_bit_rate"](this.ptr);
  }

  get nb_streams() {
    return Module["__avformat_context_nb_streams"](this.ptr);
  }

  nth_stream(i) {
    return new AVStream(Module["__avformat_context_nth_stream"](this.ptr, i));
  }

  get flags() {
    return Module["__avformat_context_flags"](this.ptr);
  }

  set flags(f) {
    Module["__avformat_context_set_flags"](this.ptr, f);
  }

  set pb(p) {
    Module["__avformat_context_set_pb"](this.ptr, p.ptr);
  }
}

class AVInputFormat extends Base {
  get name() {
    const { UTF8ToString, __avinput_format_name } = Module;
    return UTF8ToString(__avinput_format_name(this.ptr));
  }
}

class AVOutputFormat extends Base {
  get flags() {
    return Module["__avoutput_format_flags"](this.ptr);
  }
}

class AVCodec extends Base {
  get pix_fmts() {
    return Module["__avcodec_pix_fmts"](this.ptr);
  }

  nth_pix_fmt(i) {
    return Module["__avcodec_nth_pix_fmt"](this.ptr, i);
  }
}

class AVStream extends Base {
  get codecpar() {
    return new AVCodecParameters(Module["__avstream_codecpar"](this.ptr));
  }

  get time_base() {
    return new AVRational(Module["__avstream_time_base"](this.ptr));
  }

  get avg_frame_rate() {
    return new AVRational(Module["__avstream_avg_frame_rate"](this.ptr));
  }

  set time_base(tb) {
    Module["__avstream_set_time_base"](this.ptr, tb.ptr);
  }
}

class AVCodecContext extends Base {
  get priv_data() {
    return Module["__avcodec_context_priv_data"](this.ptr);
  }

  get height() {
    return Module["__avcodec_context_height"](this.ptr);
  }

  get width() {
    return Module["__avcodec_context_width"](this.ptr);
  }

  get sample_aspect_ratio() {
    return Module["__avcodec_context_sample_aspect_ratio"](this.ptr);
  }

  get time_base() {
    return new AVRational(Module["__avcodec_context_time_base"](this.ptr));
  }

  set height(h) {
    Module["__avcodec_context_set_height"](this.ptr, h);
  }

  set width(w) {
    Module["__avcodec_context_set_width"](this.ptr, w);
  }

  set sample_aspect_ratio(r) {
    Module["__avcodec_context_set_sample_aspect_ratio"](this.ptr, r);
  }

  set pix_fmt(pf) {
    Module["__avcodec_context_set_pix_fmt"](this.ptr, pf);
  }

  set bit_rate(r) {
    Module["__avcodec_context_set_bit_rate"](this.ptr, r);
  }

  set rc_buffer_size(s) {
    Module["__avcodec_context_set_rc_buffer_size"](this.ptr, s);
  }

  set rc_max_rate(r) {
    Module["__avcodec_context_set_rc_max_rate"](this.ptr, r);
  }

  set rc_min_rate(r) {
    Module["__avcodec_context_set_rc_min_rate"](this.ptr, r);
  }

  set time_base(tb) {
    Module["__avcodec_context_set_time_base"](this.ptr, tb.ptr);
  }
}

class AVCodecParameters extends Base {
  get codec_id() {
    return Module["__avcodec_parameters_codec_id"](this.ptr);
  }

  get codec_type() {
    return Module["__avcodec_parameters_codec_type"](this.ptr);
  }
}

class AVRational extends Base {
  get num() {
    return Module["__avrational_num"](this.ptr);
  }

  get den() {
    return Module["__avrational_den"](this.ptr);
  }
}

class AVIOContext extends Base {}

class AVDictionary extends Base {}

class AVFrame extends Base {
  set pict_type(t) {
    Module["__avframe_pict_type"](this.ptr, t);
  }
}

class AVPacket extends Base {
  get stream_index() {
    return Module["__avpacket_stream_index"](this.ptr);
  }

  set stream_index(si) {
    Module["__avpacket_set_stream_index"](this.ptr, si);
  }

  set duration(d) {
    Module["__avpacket_set_duration"](this.ptr, d);
  }
}

Module["AVFormatContext"] = AVFormatContext;
Module["AVInputFormat"] = AVInputFormat;
Module["AVCodec"] = AVCodec;
Module["AVStream"] = AVStream;
Module["AVCodecContext"] = AVCodecContext;
Module["AVCodecParameters"] = AVCodecParameters;
Module["AVRational"] = AVRational;
Module["AVIOContext"] = AVIOContext;
Module["AVDictionary"] = AVDictionary;
Module["AVFrame"] = AVFrame;
Module["AVPacket"] = AVPacket;

/**
 * Functions
 */

const stringToPtr = function (str) {
  const { _malloc, lengthBytesUTF8, stringToUTF8 } = Module;
  const len = lengthBytesUTF8(str) + 1;
  const ptr = _malloc(len);
  stringToUTF8(str, ptr, len);

  return ptr;
};

const ref = function (p) {
  const { _malloc, SIZE_I32, setValue } = Module;
  const ptr = _malloc(SIZE_I32);
  setValue(ptr, p, "i32");
  return ptr;
};

const deref = function (p) {
  return getValue(p, "i32");
};

Module["stringToPtr"] = stringToPtr;
Module["ref"] = ref;
Module["deref"] = deref;

/**
 * Initializer
 */

Module["onRuntimeInitialized"] = function () {
  Module["AVMEDIA_TYPE_VIDEO"] = Module["__avmedia_type_video"]();
  Module["AVMEDIA_TYPE_AUDIO"] = Module["__avmedia_type_audio"]();
  Module["AVFMT_GLOBALHEADER"] = Module["__avfmt_globalheader"]();
  Module["AV_CODEC_FLAG_GLOBAL_HEADER"] =
    Module["__av_codec_flag_global_header"]();
  Module["AVFMT_NOFILE"] = Module["__avfmt_nofile"]();
  Module["AVIO_FLAG_WRITE"] = Module["__avio_flag_write"]();
  Module["AVERROR_EOF"] = Module["__averror_eof"]();
  Module["AVERROR_EAGAIN"] = Module["__averror_eagain"]();
  Module["AV_PICTURE_TYPE_NONE"] = Module["__av_picture_type_none"]();
};
