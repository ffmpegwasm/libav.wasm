/**
 * Constants
 */

Module["NULL"] = 0;
Module["SIZE_I32"] = Uint32Array.BYTES_PER_ELEMENT;

/**
 * Classes
 */

class AVFormatContext {
  constructor(ptr) {
    this.ptr = ptr;
  }

  get url() {
    const { UTF8ToString, __avformat_context_url } = Module;
    return UTF8ToString(__avformat_context_url(this.ptr));
  }

  get iformat() {
    return new AVInputFormat(Module["__avformat_context_iformat"](this.ptr));
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
}

class AVInputFormat {
  constructor(ptr) {
    this.ptr = ptr;
  }

  get name() {
    const { UTF8ToString, __avinput_format_name } = Module;
    return UTF8ToString(__avinput_format_name(this.ptr));
  }
}

class AVCodec {
  constructor(ptr) {
    this.ptr = ptr;
  }
}

class AVStream {
  constructor(ptr) {
    this.ptr = ptr;
  }

  get codecpar() {
    return new AVCodecParameters(Module["__avstream_codecpar"](this.ptr));
  }
}

class AVCodecContext {
  constructor(ptr) {
    this.ptr = ptr;
  }
}

class AVCodecParameters {
  constructor(ptr) {
    this.ptr = ptr;
  }

  get codec_id() {
    return Module["__avcodec_parameters_codec_id"](this.ptr);
  }

  get codec_type() {
    return Module["__avcodec_parameters_codec_type"](this.ptr);
  }
}

Module["AVFormatContext"] = AVFormatContext;
Module["AVInputFormat"] = AVInputFormat;
Module["AVCodec"] = AVCodec;
Module["AVStream"] = AVStream;
Module["AVCodecContext"] = AVCodecContext;

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
