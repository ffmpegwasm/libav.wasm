#include<libavcodec/avcodec.h>
#include<libavutil/avutil.h>
#include<emscripten.h>

/**
 * struct AVCodecParameters
 */

EMSCRIPTEN_KEEPALIVE
enum AVCodecID _avcodec_parameters_codec_id(AVCodecParameters *par) {
	return par->codec_id;
}

EMSCRIPTEN_KEEPALIVE
enum AVMediaType _avcodec_parameters_codec_type(AVCodecParameters *par) {
	return par->codec_type;
}
