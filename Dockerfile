# Base emsdk image with environment variables.
FROM emscripten/emsdk:3.1.18 AS emsdk-base
ENV INSTALL_DIR=/src/build
ENV CFLAGS="$CFLAGS -O3"
ENV FFMPEG_VERSION=n5.1

# Build x264
FROM emsdk-base AS x264-builder
RUN git clone \
			--branch stable \
			--depth 1 \
			https://github.com/ffmpegwasm/x264 \
			/src
RUN emconfigure ./configure \
			--prefix=$INSTALL_DIR \
			--host=i686-gnu \
			--enable-static \
			--disable-cli \
			--disable-asm \
			--disable-thread \
			--extra-cflags="$CFLAGS"
RUN emmake make install-lib-static -j

# Base liav image with dependencies and source code populated.
FROM emsdk-base AS libav-base
RUN apt-get update && \
			apt-get install -y pkg-config
RUN embuilder build sdl2
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
  --disable-x86asm \
  --disable-inline-asm \
  --disable-stripping \
  --disable-programs \
  --disable-doc \
  --disable-debug \
  --disable-runtime-cpudetect \
  --disable-autodetect \
	--disable-pthreads \
	--disable-w32threads \
	--disable-os2threads \
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
COPY src /src/wasm
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
  -s MODULARIZE \
	-s EXPORTED_RUNTIME_METHODS=FS,setValue,UTF8ToString,lengthBytesUTF8,stringToUTF8 \
	--pre-js wasm/bind/util.js \
	-o dist/libav.js \
	wasm/bind/**/*.c

# Export libav.wasm to dist/, use `docker buildx build -o . .` to get assets
FROM scratch AS exportor
COPY --from=libav-wasm-builder /src/dist /dist
