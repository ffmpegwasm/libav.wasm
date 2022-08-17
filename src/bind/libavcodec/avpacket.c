#include<libavcodec/packet.h>
#include<emscripten.h>

/**
 * Functions
 */

EMSCRIPTEN_KEEPALIVE
void _av_packet_rescale_ts(AVPacket *pkt, AVRational *src_tb, AVRational *dst_tb) {
	av_packet_rescale_ts(pkt, *src_tb, *dst_tb);
}
