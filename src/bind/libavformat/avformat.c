#include<libavformat/avformat.h>
#include<emscripten.h>

/**
 * struct AVFormatContext
 */

EMSCRIPTEN_KEEPALIVE
const AVInputFormat *_avformat_context_iformat(AVFormatContext *ctx) {
	return ctx->iformat;
}

EMSCRIPTEN_KEEPALIVE
int64_t _avformat_context_duration(AVFormatContext *ctx) {
	return ctx->duration;
}

EMSCRIPTEN_KEEPALIVE
int64_t _avformat_context_bit_rate(AVFormatContext *ctx) {
	return ctx->bit_rate;
}

/**
 * struct AVInputFormat
 */

EMSCRIPTEN_KEEPALIVE
const char* _avinput_format_name(AVInputFormat *iformat) {
	return iformat->name;
}

/**
 * Functions.
 */

EMSCRIPTEN_KEEPALIVE
void _avformat_free_context(AVFormatContext *s) {
	avformat_free_context(s);
}
