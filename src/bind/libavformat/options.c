#include<libavformat/avformat.h>
#include<emscripten.h>

EMSCRIPTEN_KEEPALIVE
AVFormatContext *_avformat_alloc_context(void) {
	return avformat_alloc_context();
}
