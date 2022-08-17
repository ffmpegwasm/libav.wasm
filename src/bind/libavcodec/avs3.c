#include<libavutil/avutil.h>
#include<emscripten.h>

EMSCRIPTEN_KEEPALIVE
enum AVPictureType _av_picture_type_none() {
	return AV_PICTURE_TYPE_NONE;
}
