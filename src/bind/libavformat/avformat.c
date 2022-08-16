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
char *_avformat_context_url(AVFormatContext *ctx) {
	return ctx->url;
}

EMSCRIPTEN_KEEPALIVE
int64_t _avformat_context_duration(AVFormatContext *ctx) {
	return ctx->duration;
}

EMSCRIPTEN_KEEPALIVE
int64_t _avformat_context_bit_rate(AVFormatContext *ctx) {
	return ctx->bit_rate;
}

EMSCRIPTEN_KEEPALIVE
int64_t _avformat_context_nb_streams(AVFormatContext *ctx) {
	return ctx->nb_streams;
}

EMSCRIPTEN_KEEPALIVE
AVStream *_avformat_context_nth_stream(AVFormatContext *ctx, size_t i) {
	return ctx->streams[i];
}


/**
 * struct AVInputFormat
 */

EMSCRIPTEN_KEEPALIVE
const char* _avinput_format_name(AVInputFormat *iformat) {
	return iformat->name;
}

/**
 * struct AVStream
 */

EMSCRIPTEN_KEEPALIVE
AVCodecParameters *_avstream_codecpar(AVStream *stream) {
	return stream->codecpar;
}

