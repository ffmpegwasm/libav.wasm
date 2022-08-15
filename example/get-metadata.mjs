import { createLibav } from "../src/index.js";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { argv, exit } from "node:process";

const [, , filePath] = argv;

if (!filePath) {
  console.log("Usage: node get-metadata.js <FILE_PATH>");
  exit(1);
}

const fileName = basename(filePath);
const media = Uint8Array.from(readFileSync(filePath));

// load libav module.
console.time("load-libav");
const { FS, NULL, avformat_alloc_context, avformat_open_input } =
  await createLibav();
console.timeEnd("load-libav");

// write file to WASM filesystem.
FS.writeFile(basename(fileName), media);

// get media meta data using libav functions.
console.time("get-metadata");
const ctx = avformat_alloc_context();
avformat_open_input(ctx, fileName, NULL, NULL);

console.log(`file name: ${fileName}, size: ${media.length} bytes`);
console.log(`format: ${ctx.iformat.name}`);
console.log(`duration: ${ctx.duration}`);
console.log(`bit rate: ${ctx.bit_rate}`);
console.timeEnd("get-metadata");
