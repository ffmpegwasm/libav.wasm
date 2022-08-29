import createLibavCore from "@ffmpeg/libav-core";
import { argv } from "node:process";

(async () => {
  const funcs = Object.keys(await createLibavCore()).sort();

  const [, , target] = argv;

  if (target) {
    if (funcs.includes(target)) {
      console.log(`found ${target}!`);
      return;
    }
    console.log(`unable to find ${target}`);
  }

  console.log(JSON.stringify(funcs, null, 2));
})();
