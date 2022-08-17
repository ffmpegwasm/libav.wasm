#include<libavcodec/codec.h>
#include<emscripten.h>

/**
 * struct AVCodec
 */

EMSCRIPTEN_KEEPALIVE
const enum AVPixelFormat *_avcodec_pix_fmts(AVCodec *c) {
	return c->pix_fmts;
}

EMSCRIPTEN_KEEPALIVE
enum AVPixelFormat _avcodec_nth_pix_fmt(AVCodec *c, size_t i) {
	return c->pix_fmts[i];
}
