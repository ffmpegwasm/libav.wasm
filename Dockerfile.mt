# Base emsdk image with environment variables.
FROM emscripten/emsdk:3.1.18 AS emsdk-base
ARG EXTRA_CFLAGS
ARG EXTRA_LDFLAGS
ENV INSTALL_DIR=/src/build
ENV FFMPEG_VERSION=n5.1
ENV CFLAGS="$CFLAGS -sUSE_PTHREADS -pthread $EXTRA_CFLAGS"
ENV LDFLAGS="$LDFLAGS $CFLAGS $EXTRA_LDFLAGS"
ENV EM_PKG_CONFIG_PATH=$EM_PKG_CONFIG_PATH:$INSTALL_DIR/lib/pkgconfig:/emsdk/upstream/emscripten/system/lib/pkgconfig
ENV PKG_CONFIG_PATH=$PKG_CONFIG_PATH:$EM_PKG_CONFIG_PATH

# Build x264
FROM emsdk-base AS x264-builder
RUN git clone \
      --branch 4-cores \
      --depth 1 \
      https://github.com/ffmpegwasm/x264 \
      /src
RUN emconfigure ./configure \
      --prefix=$INSTALL_DIR \
      --host=x86-gnu \
      --enable-static \
      --disable-cli \
      --disable-asm \
      --extra-cflags="$CFLAGS"
RUN emmake make install-lib-static -j

# Base liav image with dependencies and source code populated.
FROM emsdk-base AS libav-base
RUN apt-get update && \
      apt-get install -y pkg-config
RUN embuilder build sdl2-mt
RUN git clone \
      --branch $FFMPEG_VERSION \
      --depth 1 \
      https://github.com/FFmpeg/FFmpeg \
      /src
COPY --from=x264-builder $INSTALL_DIR $INSTALL_DIR

# Build libav
FROM libav-base AS libav-builder
RUN emconfigure ./configure \
  --target-os=none \
  --arch=x86_32 \
  --enable-cross-compile \
  --disable-asm \
  --disable-stripping \
  --disable-programs \
  --disable-doc \
  --disable-debug \
  --disable-runtime-cpudetect \
  --disable-autodetect \
  --extra-cflags="$CFLAGS" \
  --extra-cxxflags="$CFLAGS" \
  --nm="llvm-nm" \
  --ar=emar \
  --ranlib=emranlib \
  --cc=emcc \
  --cxx=em++ \
  --objcc=emcc \
  --dep-cc=emcc \
  --enable-gpl \
  --enable-libx264 \
  && \
  emmake make -j

# Build libav.wasm
FROM libav-builder AS libav-wasm-builder
RUN mkdir -p /src/src
COPY src/bind /src/src/bind
RUN mkdir -p /src/dist
RUN emcc \
  -I. \
  -I$INSTALL_DIR/include \
  -L$INSTALL_DIR/lib \
  -Llibavcodec \
  -Llibavdevice \
  -Llibavfilter \
  -Llibavformat \
  -Llibavutil \
  -Llibpostproc \
  -Llibswresample \
  -Llibswscale \
  -lavcodec \
  -lavdevice \
  -lavfilter \
  -lavformat \
  -lavutil \
  -lpostproc \
  -lswresample \
  -lswscale \
  -lx264 \
  -Wno-deprecated-declarations \
  $LDFLAGS \
  -sPTHREAD_POOL_SIZE=8 \
  -sINITIAL_MEMORY=1024MB \
  -sMODULARIZE \
  -sEXPORT_NAME="createLibavCore" \
  -sEXPORTED_FUNCTIONS=$(node src/bind/export.js) \
  -sEXPORTED_RUNTIME_METHODS=$(node src/bind/export-runtime.js) \
  --pre-js src/bind/bind.js \
  -o dist/libav-core.js \
  src/bind/**/*.c

# Export libav.wasm to dist/, use `docker buildx build -o . .` to get assets
FROM scratch AS exportor
COPY --from=libav-wasm-builder /src/dist /dist
