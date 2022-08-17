#include<libavutil/avutil.h>
#include<emscripten.h>

EMSCRIPTEN_KEEPALIVE
int _averror_eof() {
	return AVERROR_EOF;
}

EMSCRIPTEN_KEEPALIVE
int _averror_eagain() {
	return AVERROR(EAGAIN);
}
