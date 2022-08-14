#include<libavformat/avformat.h>
#include<emscripten.h>

/*
 * The signatures of _avformat_open_input and avformat_open_input
 * are different as we cannot get the address of a pointer
 * in the JS world.
 */
EMSCRIPTEN_KEEPALIVE
int _avformat_open_input(AVFormatContext *ps, const char *url,
		const AVInputFormat *fmt, AVDictionary *options) {
	return avformat_open_input(&ps, url, fmt, &options);
}

