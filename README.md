# libav.wasm

> libav.wasm is still under development and far from production use.

libav WebAssembly port.

## Background

libav (incl. libavcodec, libavformat, …) is the library behind FFmpeg to
record, convert and stream audio and video. This repository aims to port
libav to WebAssembly to allow users edit video and audio directly inside
 the browser.

### Why not ffmpeg.wasm?

ffmpeg.wasm ports FFmpeg to WebAssembly using a more coarse-grained approach,
  it works but also suffers from the isolation of C and JavaScript world which
  makes it hard to develop and improve.

The ultimate goal of libav.wasm is to enable a ffmpeg.wasm with better developer
 experience (DX) and potentially be the foundation to fix issues like performance
 and more.

## Get Started

We use docker to achieve a (hopefully) reproducible build paradigm, so it is
required to install docker 19.03 or above before you run any build script.

- Build liba.wasm

```bash
bash build.sh
```

If nothing went wrong, you should find libav assets in **dist/**.

## Run

A few examples can be found in **example/**, feel free to try and see how
it works in action.

## Library Versions

| Name  | Version |
| ----- | ------- |
| emsdk | 3.1.18  |
| FFmpeg | 5.1  |
| x264 | 0.160.x  |
