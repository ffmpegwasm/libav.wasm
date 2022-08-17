import { createLibav } from "../src/index.js";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { argv, exit } from "node:process";

const [, , filePath] = argv;

if (!filePath) {
  console.log("Usage: node metadata.js <FILE_PATH>");
  exit(1);
}

const fileName = basename(filePath);
const media = Uint8Array.from(readFileSync(filePath));

// load libav module.
console.time("load-libav");
const {
  FS: { writeFile, unlink },
  NULL,
  ref,
  deref,
  stringToPtr,
  AVFormatContext,
  _avformat_alloc_context,
  _avformat_open_input,
  _avformat_free_context,
} = await createLibav();
console.timeEnd("load-libav");

// write file to WASM filesystem.
writeFile(fileName, media);

// get media meta data using libav functions.
console.time("get-metadata");
const ctx = new AVFormatContext(_avformat_alloc_context());
const ptr = ref(ctx.ptr);
_avformat_open_input(ptr, stringToPtr(fileName), NULL, NULL);
ctx.ptr = deref(ptr);

console.log(`file name: ${fileName}, size: ${media.length} bytes`);
console.log(`format: ${ctx.iformat.name}`);
console.log(`url: ${ctx.url}`);
console.log(`duration: ${ctx.duration}`);
console.log(`bit rate: ${ctx.bit_rate}`);
console.timeEnd("get-metadata");

_avformat_free_context(ctx.ptr);
unlink(fileName);
