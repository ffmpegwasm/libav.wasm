#include<libavformat/avformat.h>
#include<emscripten.h>

/**
 * struct AVIOContext
 */

/**
 * Functions
 */

EMSCRIPTEN_KEEPALIVE
int _avio_flag_write() {
	return AVIO_FLAG_WRITE;
}
