import LibavCoreFactory from "ffmpeg__libav-core";

type Libav = Awaited<ReturnType<typeof LibavCoreFactory>>;

let libav: Libav;

export const initLibav = (_libav: Libav) => {
  libav = _libav;
};

export const getLibav = (): Libav => {
  if (!libav) {
    console.error(
      "libav is not initialized, initLibav() should be called first!"
    );
  }
  return libav;
};
