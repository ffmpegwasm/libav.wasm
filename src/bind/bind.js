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

const ref = function (p) {
  const { _malloc, SIZE_I32, setValue } = Module;
  const ptr = _malloc(SIZE_I32);
  setValue(ptr, p, "i32");
  return ptr;
};

const avformat_alloc_context = function () {
  return new AVFormatContext(Module["_avformat_alloc_context"]());
};

const avformat_free_context = function (ctx) {
  Module["_avformat_free_context"](ctx.ptr);
};

const avformat_open_input = function (ctx, url, fmt, options) {
  const { ref, _avformat_open_input } = Module;
  return _avformat_open_input(
    ref(ctx.ptr),
    stringToPtr(url),
    fmt,
    ref(options)
  );
};

Module["stringToPtr"] = stringToPtr;
Module["ref"] = ref;

Module["avformat_alloc_context"] = avformat_alloc_context;
Module["avformat_free_context"] = avformat_free_context;
Module["avformat_open_input"] = avformat_open_input;
