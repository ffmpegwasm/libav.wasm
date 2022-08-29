let libav: EmscriptenModule;

export const initLibav = (_libav: EmscriptenModule) => {
  libav = _libav;
};

export const getLibav = () => {
  if (!libav) {
    console.error(
      "libav is not initialized, initLibav() should be called first!"
    );
  }
  return libav;
};
