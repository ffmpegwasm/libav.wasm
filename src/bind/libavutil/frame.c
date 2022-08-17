#include<libavutil/frame.h>
#include<emscripten.h>

/**
 * struct AVFrame
 */

EMSCRIPTEN_KEEPALIVE
void _avframe_pict_type(AVFrame *f, enum AVPictureType pict_type) {
	f->pict_type = pict_type;
}
