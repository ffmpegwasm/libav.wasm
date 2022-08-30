import createLibavCore from "@ffmpeg/libav-core";
import { initLibav, getLibav } from "@ffmpeg/libav";
import { argv } from "node:process";

(async () => {
  initLibav(await createLibavCore());

  const libav = getLibav();
  const keys = Object.keys(libav).sort();

  const [, , target] = argv;

  if (target) {
    if (keys.includes(target)) {
      console.log(`found ${target}!`);
      return;
    }
    console.log(`unable to find ${target}`);
  }

  console.log(JSON.stringify(keys, null, 2));
})();
