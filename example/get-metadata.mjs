import createLibav from "../dist/libav.js";
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
console.time("load-libav");
const {
  FS,
  NULL,
  UTF8ToString,
  avformat_alloc_context,
  avformat_open_input,
  __avformat_context_iformat,
  __avinput_format_name,
  __avformat_context_duration,
  __avformat_context_bit_rate,
} = await createLibav();
console.timeEnd("load-libav");

FS.writeFile(basename(fileName), media);

console.time("get-metadata");
const ctx = avformat_alloc_context();
avformat_open_input(ctx, fileName, NULL, NULL);
const iformat = __avformat_context_iformat(ctx);

console.log(`file name: ${fileName}, size: ${media.length} bytes`);
console.log(`format: ${UTF8ToString(__avinput_format_name(iformat))}`);
console.log(`duration: ${__avformat_context_duration(ctx)}`);
console.log(`bit rate: ${__avformat_context_bit_rate(ctx)}`);
console.timeEnd("get-metadata");