/**
 * Constants
 */

Module["NULL"] = 0;

/**
 * Classes
 */

class AVFormatContext {
  constructor(ptr) {
    this.ptr = ptr;
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

Module["AVFormatContext"] = AVFormatContext;
Module["AVInputFormat"] = AVInputFormat;

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

const avformat_alloc_context = function () {
  return new AVFormatContext(Module["__avformat_alloc_context"]());
};

const avformat_open_input = function (ctx, url, fmt, options) {
  return Module["__avformat_open_input"](
    ctx.ptr,
    stringToPtr(url),
    fmt,
    options
  );
};

Module["stringToPtr"] = stringToPtr;
Module["avformat_alloc_context"] = avformat_alloc_context;
Module["avformat_open_input"] = avformat_open_input;
