const stringToPtr = function (str) {
  const { _malloc, lengthBytesUTF8, stringToUTF8 } = Module;
  const len = lengthBytesUTF8(str) + 1;
  const ptr = _malloc(len);
	stringToUTF8(str, ptr, len);

  return ptr;
};

Module["NULL"] = 0;
Module["stringToPtr"] = stringToPtr;
