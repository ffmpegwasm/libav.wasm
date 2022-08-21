# libav.wasm

[![stability-wip](https://img.shields.io/badge/stability-wip-lightgrey.svg)]()
[![](https://dcbadge.vercel.app/api/server/Y7k6NJ3bFc?style=flat)](https://discord.gg/Y7k6NJ3bFc)
[![Build libav.wasm](https://github.com/ffmpegwasm/libav.wasm/actions/workflows/build-libav-wasm.yml/badge.svg)](https://github.com/ffmpegwasm/libav.wasm/actions/workflows/build-libav-wasm.yml)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/ffmpegwasm/libav.wasm)

libav WebAssembly port.

- [Background](#background)
- [Get Started](#get-started)
- [Try it!](#try-it)
- [Configuration](#configuration)

## Background

libav (incl. libavcodec, libavformat, …) is the library behind FFmpeg to
record, convert and stream audio and video. This repository aims to port
libav to WebAssembly to allow users edit video and audio directly inside
 the browser.

### Why not ffmpeg.wasm?

ffmpeg.wasm ports FFmpeg to WebAssembly using a more coarse-grained approach
(you can imagine ffmpeg.wasm as an extremely large function, once it starts to
 run, there isn't much you can control.), it works but also suffers from the
isolation of C and JavaScript world which makes it hard to develop and improve.

The ultimate goal of libav.wasm is to enable a ffmpeg.wasm with better developer
 experience (DX) and potentially be the foundation to fix issues like performance
 and more.

## Get Started

We use docker to achieve a (hopefully) cached and reproducible build, so it is
required to install docker 19.03 or above before you run any build script.

- Build libav.wasm

```bash
# build `dev` version
$ make

# build `prod` version (slower, optimized with -O3)
$ make prod
```

If nothing went wrong, you should find libav assets in **dist/**.

## Try it

A few examples can be found in **example/**, feel free to try and see how
it works in action.

> As these examples use video files in testdata/, you need to do a 
`git submodule update --init` first

- metadata: use libav.wasm to extra video metadata

```
make run-metadata
```

- transcode: use libav.wasm to transcode mp4 to a gop fixed mp4

```
make run-transcode
```

## Configuration

libav.wasm is built using tools/libraries with version:

| Name  | Version |
| ----- | ------- |
| emsdk | 3.1.18  |
| FFmpeg | n5.1  |
| x264 | 0.160.x  |
