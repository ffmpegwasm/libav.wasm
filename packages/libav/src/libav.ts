import { LibavCore } from "../../libav-type/index.d";

let libav: LibavCore;

export const initLibav = (_libav: LibavCore) => {
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
