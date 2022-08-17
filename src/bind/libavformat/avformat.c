#include<libavformat/avformat.h>
#include<stdlib.h>
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

EMSCRIPTEN_KEEPALIVE
const AVOutputFormat *_avformat_context_oformat(AVFormatContext *ctx) {
	return ctx->oformat;
}

EMSCRIPTEN_KEEPALIVE
int _avformat_context_flags(AVFormatContext *ctx) {
	return ctx->flags;
}

EMSCRIPTEN_KEEPALIVE
AVIOContext *_avformat_context_pb(AVFormatContext *ctx) {
	return ctx->pb;
}

EMSCRIPTEN_KEEPALIVE
void _avformat_context_set_flags(AVFormatContext *ctx, int flags) {
	ctx->flags = flags;
}

EMSCRIPTEN_KEEPALIVE
void _avformat_context_set_pb(AVFormatContext *ctx, AVIOContext *pb) {
	ctx->pb = pb;
}

/**
 * struct AVInputFormat
 */

EMSCRIPTEN_KEEPALIVE
const char* _avinput_format_name(AVInputFormat *iformat) {
	return iformat->name;
}

/**
 * struct AVOutputFormat
 */

EMSCRIPTEN_KEEPALIVE
int _avoutput_format_flags(AVOutputFormat *oformat) {
	return oformat->flags;
}

/**
 * struct AVStream
 */

EMSCRIPTEN_KEEPALIVE
AVCodecParameters *_avstream_codecpar(AVStream *stream) {
	return stream->codecpar;
}

EMSCRIPTEN_KEEPALIVE
AVRational *_avstream_avg_frame_rate(AVStream *stream) {
	return &stream->avg_frame_rate;
}

EMSCRIPTEN_KEEPALIVE
AVRational *_avstream_time_base(AVStream *stream) {
	return &stream->time_base;
}

EMSCRIPTEN_KEEPALIVE
void _avstream_set_time_base(AVStream *stream, AVRational *time_base) {
	stream->time_base = *time_base;
}

/**
 * Functions
 */

EMSCRIPTEN_KEEPALIVE
AVRational *_av_guess_frame_rate(AVFormatContext *format, AVStream *st, AVFrame *frame) {
	AVRational r = av_guess_frame_rate(format, st, frame);
	AVRational *ret = (AVRational*)calloc(1, sizeof(AVRational));
	ret->num = r.num;
	ret->den = r.den;
	return ret;
}

EMSCRIPTEN_KEEPALIVE
int _avfmt_globalheader() {
	return AVFMT_GLOBALHEADER;
}

EMSCRIPTEN_KEEPALIVE
int _avfmt_nofile() {
	return AVFMT_NOFILE;
}
