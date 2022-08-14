const stringToPtr = function (str) {
  const len = str.length;
  const { _malloc } = Module;
  const ptr = _malloc(len + 1);

  writeAsciiToMemory(str, ptr);

  return ptr;
};

Module["NULL"] = 0;
Module["stringToPtr"] = stringToPtr;
