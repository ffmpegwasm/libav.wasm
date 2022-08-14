const stringToPtr = function (str) {
  const { _malloc, lengthBytesUTF8, stringToUTF8 } = Module;
  const len = lengthBytesUTF8(str) + 1;
  const ptr = _malloc(len);
	stringToUTF8(str, ptr, len);

  return ptr;
};

const avformat_alloc_context = function() {
	return Module["__avformat_alloc_context"]();
};

const avformat_open_input = function(ps, url, fmt, options) {
	return Module["__avformat_open_input"](ps, stringToPtr(url), fmt, options);
};

Module["NULL"] = 0;
Module["stringToPtr"] = stringToPtr;
Module["avformat_alloc_context"] = avformat_alloc_context;
Module["avformat_open_input"] = avformat_open_input;
