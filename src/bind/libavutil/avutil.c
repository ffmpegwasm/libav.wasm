#include<libavutil/avutil.h>
#include<emscripten.h>

EMSCRIPTEN_KEEPALIVE
enum AVMediaType _avmedia_type_video() {
	return AVMEDIA_TYPE_VIDEO;
}

EMSCRIPTEN_KEEPALIVE
enum AVMediaType _avmedia_type_audio() {
	return AVMEDIA_TYPE_AUDIO;
}
