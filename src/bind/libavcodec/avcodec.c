#include<libavcodec/avcodec.h>
#include<libavutil/avutil.h>
#include<emscripten.h>

/**
 * struct AVCodecContext
 */

EMSCRIPTEN_KEEPALIVE
void *_avcodec_context_priv_data(AVCodecContext *ctx) {
	return ctx->priv_data;
}

EMSCRIPTEN_KEEPALIVE
int _avcodec_context_height(AVCodecContext *ctx) {
	return ctx->height;
}

EMSCRIPTEN_KEEPALIVE
int _avcodec_context_width(AVCodecContext *ctx) {
	return ctx->width;
}

EMSCRIPTEN_KEEPALIVE
AVRational *_avcodec_context_sample_aspect_ratio(AVCodecContext *ctx) {
	return &ctx->sample_aspect_ratio;
}

EMSCRIPTEN_KEEPALIVE
enum AVPixelFormat _avcodec_context_pix_fmt(AVCodecContext *ctx) {
	return ctx->pix_fmt;
}

EMSCRIPTEN_KEEPALIVE
AVRational *_avcodec_context_time_base(AVCodecContext *ctx) {
	return &ctx->time_base;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_height(AVCodecContext *ctx, int height) {
	ctx->height = height;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_width(AVCodecContext *ctx, int width) {
	ctx->width = width;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_sample_aspect_ratio(AVCodecContext *ctx, AVRational ratio) {
	ctx->sample_aspect_ratio = ratio;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_pix_fmt(AVCodecContext *ctx, enum AVPixelFormat pixel_fmt) {
	ctx->pix_fmt = pixel_fmt;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_bit_rate(AVCodecContext *ctx, int64_t bit_rate) {
	ctx->bit_rate = bit_rate;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_rc_buffer_size(AVCodecContext *ctx, int rc_buffer_size) {
	ctx->rc_buffer_size = rc_buffer_size;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_rc_max_rate(AVCodecContext *ctx, int64_t rc_max_rate) {
	ctx->rc_max_rate = rc_max_rate;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_rc_min_rate(AVCodecContext *ctx, int64_t rc_min_rate) {
	ctx->rc_min_rate = rc_min_rate;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_time_base(AVCodecContext *ctx, AVRational *time_base) {
	ctx->time_base = *time_base;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_channels(AVCodecContext *ctx, int channels) {
	ctx->channels = channels;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_channel_layout(AVCodecContext *ctx, int64_t channel_layout) {
	ctx->channel_layout = channel_layout;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_sample_fmt(AVCodecContext *ctx, enum AVSampleFormat sample_fmt) {
	ctx->sample_fmt = sample_fmt;
}

EMSCRIPTEN_KEEPALIVE
void _avcodec_context_set_strict_std_compliance(AVCodecContext *ctx, int ssc) {
	ctx->strict_std_compliance = ssc;
}

/**
 * Functions
 */
EMSCRIPTEN_KEEPALIVE
int _av_codec_flag_global_header() {
	return AV_CODEC_FLAG_GLOBAL_HEADER;
}

EMSCRIPTEN_KEEPALIVE
int _ff_compliance_experimental() {
	return FF_COMPLIANCE_EXPERIMENTAL;
}
