#include<libavcodec/avcodec.h>
#include<emscripten.h>

/**
 * struct AVPacket
 */

EMSCRIPTEN_KEEPALIVE
int _avpacket_stream_index(AVPacket *p) {
	return p->stream_index;
}

EMSCRIPTEN_KEEPALIVE
void _avpacket_set_stream_index(AVPacket *p, int stream_index) {
	p->stream_index = stream_index;
}

EMSCRIPTEN_KEEPALIVE
void _avpacket_set_duration(AVPacket *p, int duration) {
	p->duration = duration;
}
