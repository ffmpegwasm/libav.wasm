#include<libavutil/rational.h>
#include<stdlib.h>
#include<emscripten.h>

/**
 * struct AVRational
 */

EMSCRIPTEN_KEEPALIVE
int _avrational_num(AVRational *r) {
	return r->num;
}

EMSCRIPTEN_KEEPALIVE
int _avrational_den(AVRational *r) {
	return r->den;
}

/**
 * Functions
 */

EMSCRIPTEN_KEEPALIVE
AVRational *_av_inv_q(AVRational *q) {
	AVRational *ret = (AVRational*)calloc(1, sizeof(AVRational));
	ret->num = q->den;
	ret->den = q->num;
	return ret;
}
