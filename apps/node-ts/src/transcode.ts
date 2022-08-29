/**
 * @ref: https://github.com/leandromoreira/ffmpeg-libav-tutorial/blob/46e8aba7bf1bc337d9b665f3541449d45e9d4202/3_transcoding.c
 */

// @ts-nocheck
import createLibavCore from "@ffmpeg/libav-core";
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { argv, exit } from "node:process";

(async () => {
  // load libav module.
  console.time("load-libav");
  const {
    FS: { writeFile, readFile },
    NULL,
    ref,
    deref,
    stringToPtr,
    AVIOContext,
    AVCodec,
    AVCodecContext,
    AVDictionary,
    AVERROR_EAGAIN,
    AVERROR_EOF,
    AVFMT_GLOBALHEADER,
    AVFMT_NOFILE,
    AVFormatContext,
    AVFrame,
    AVIO_FLAG_WRITE,
    AVMEDIA_TYPE_AUDIO,
    AVMEDIA_TYPE_VIDEO,
    AVPacket,
    AVRational,
    AVStream,
    AV_CODEC_FLAG_GLOBAL_HEADER,
    AV_PICTURE_TYPE_NONE,
    __av_guess_frame_rate,
    __av_inv_q,
    __av_packet_rescale_ts,
    _av_dict_set,
    _av_frame_alloc,
    _av_frame_unref,
    _av_interleaved_write_frame,
    _av_opt_set,
    _av_packet_alloc,
    _av_packet_free,
    _av_packet_unref,
    _av_read_frame,
    _av_write_trailer,
    _avcodec_alloc_context3,
    _avcodec_find_decoder,
    _avcodec_find_encoder_by_name,
    _avcodec_open2,
    _avcodec_parameters_copy,
    _avcodec_parameters_from_context,
    _avcodec_parameters_to_context,
    _avcodec_receive_frame,
    _avcodec_receive_packet,
    _avcodec_send_frame,
    _avcodec_send_packet,
    _avformat_alloc_context,
    _avformat_alloc_output_context2,
    _avformat_find_stream_info,
    _avformat_new_stream,
    _avformat_open_input,
    _avformat_write_header,
    _avio_open,
    _free,
  } = await createLibavCore();
  console.timeEnd("load-libav");

  class StreamingParams {
    copy_audio = 0;
    copy_video = 0;
    output_extension = NULL;
    muxer_opt_key = NULL;
    muxer_opt_value = NULL;
    video_codec = NULL;
    audio_codec = NULL;
    codec_priv_key = NULL;
    codec_priv_value = NULL;
  }

  class StreamingContext {
    avfc = new AVFormatContext(NULL);
    video_avc = new AVCodec(NULL);
    audio_avc = new AVCodec(NULL);
    video_avs = new AVStream(NULL);
    audio_avs = new AVStream(NULL);
    video_avcc = new AVCodecContext(NULL);
    audio_avcc = new AVCodecContext(NULL);
    video_index = -1;
    audio_index = -1;
    filename = NULL;
  }

  const fill_stream_info = (avs, avc, avcc) => {
    avc.ptr = _avcodec_find_decoder(avs.codecpar.codec_id);
    if (!avc.ptr) {
      console.log("failed to find the codec");
      return -1;
    }

    avcc.ptr = _avcodec_alloc_context3(avc.ptr);
    if (!avcc.ptr) {
      console.log("failed to alloc memory for codec context");
      return -1;
    }

    if (_avcodec_parameters_to_context(avcc.ptr, avs.codecpar.ptr) < 0) {
      console.log("failed to fill codec context");
      return -1;
    }

    if (_avcodec_open2(avcc.ptr, avc.ptr, NULL) < 0) {
      console.log("failed to open codec");
      return -1;
    }

    return 0;
  };

  const open_media = (filename, avfc) => {
    avfc.ptr = _avformat_alloc_context();
    if (!avfc.ptr) {
      console.log("failed to alloc memory for format");
      return -1;
    }

    const ptr = ref(avfc.ptr);
    if (_avformat_open_input(ptr, stringToPtr(filename), NULL, NULL) !== 0) {
      console.log("failed to open input file ", filename);
      return -1;
    }
    avfc.ptr = deref(ptr);
    _free(ptr);

    if (_avformat_find_stream_info(avfc.ptr, NULL) < 0) {
      console.log("failed to get stream info");
      return -1;
    }

    return 0;
  };

  const prepare_decoder = (sc) => {
    for (let i = 0; i < sc.avfc.nb_streams; i++) {
      const codec_type = sc.avfc.nth_stream(i).codecpar.codec_type;
      if (codec_type === AVMEDIA_TYPE_VIDEO) {
        sc.video_avs = sc.avfc.nth_stream(i);
        sc.video_index = i;
        if (fill_stream_info(sc.video_avs, sc.video_avc, sc.video_avcc))
          return -1;
      } else if (codec_type === AVMEDIA_TYPE_AUDIO) {
        sc.audio_avs = sc.avfc.nth_stream(i);
        sc.audio_index = i;
        if (fill_stream_info(sc.audio_avs, sc.audio_avc, sc.audio_avcc))
          return -1;
      } else {
        console.log("skipping streams other than audio and video");
      }
    }

    return 0;
  };

  const prepare_video_encoder = (sc, decoder_ctx, input_framerate, sp) => {
    sc.video_avs = new AVStream(_avformat_new_stream(sc.avfc.ptr, NULL));
    sc.video_avc = new AVCodec(_avcodec_find_encoder_by_name(sp.video_codec));
    if (!sc.video_avc.ptr) {
      console.log("could not find the proper codec");
      return -1;
    }

    sc.video_avcc = new AVCodecContext(
      _avcodec_alloc_context3(sc.video_avc.ptr)
    );
    if (!sc.video_avcc.ptr) {
      console.log("could not allocated memory for codec context");
      return -1;
    }

    _av_opt_set(
      sc.video_avcc.priv_data,
      stringToPtr("preset"),
      stringToPtr("fast"),
      0
    );
    if (sp.codec_priv_key && sp.codec_priv_value) {
      _av_opt_set(
        sc.video_avcc.priv_data,
        sp.codec_priv_key,
        sp.codec_priv_value,
        0
      );
    }

    sc.video_avcc.height = decoder_ctx.height;
    sc.video_avcc.width = decoder_ctx.width;
    sc.video_avcc.sample_aspect_ratio = decoder_ctx.sample_aspect_ratio;
    if (sc.video_avc.pix_fmts) {
      sc.video_avcc.pix_fmt = sc.video_avc.nth_pix_fmt(0);
    } else {
      sc.video_avcc.pix_fmt = decoder_ctx.pix_fmt;
    }

    sc.video_avcc.bit_rate = 2 * 1000 * 1000;
    sc.video_avcc.rc_buffer_size = 4 * 1000 * 1000;
    sc.video_avcc.rc_max_rate = 2 * 1000 * 1000;
    sc.video_avcc.rc_min_rate = 2.5 * 1000 * 1000;

    sc.video_avcc.time_base = new AVRational(__av_inv_q(input_framerate));
    sc.video_avs.time_base = sc.video_avcc.time_base;

    if (_avcodec_open2(sc.video_avcc.ptr, sc.video_avc.ptr, NULL) < 0) {
      console.log("colud not open the codec");
      return -1;
    }
    _avcodec_parameters_from_context(
      sc.video_avs.codecpar.ptr,
      sc.video_avcc.ptr
    );
    return 0;
  };

  const prepare_audio_encoder = (sc, sample_rate, sp) => {
    sc.audio_avs = new AVStream(_avformat_new_stream(sc.avfc.ptr, NULL));

    sc.audio_avc = new AVCodec(_avcodec_find_encoder_by_name(sp.audio_codec));
    if (!sc.audio_avc.ptr) {
      console.log("could not find the proper codec");
      return -1;
    }

    sc.audio_avcc = new AVCodec(_avcodec_alloc_context3(sc.audio_avc.ptr));
    if (!sc.audio_avcc.ptr) {
      console.log("could not allocatd memory for codec context");
      return -1;
    }

    const OUTPUT_CHANNELS = 2;
    const OUTPUT_BIT_RATE = 196000;

    sc.audio_avcc.channels = OUTPUT_CHANNELS;
    sc.audio_avcc.channel_layout =
      _av_get_default_channel_layout(OUTPUT_CHANNELS);
    sc.audio_avcc.sample_rate = sample_rate;
    sc.audio_avcc.sample_fmt = sc.audio_avc.nth_sample_fmt(0);
    sc.audio_avcc.bit_rate = OUTPUT_BIT_RATE;
    sc.audio.avcc.time_base = new AVRational(
      __av_rational_alloc(1, sample_rate)
    );
    sc.audio_avcc.strict_std_compliance = FF_COMPLIANCE_EXPERIMENTAL;
    sc.audio_avs.time_base = sc.audio_avcc.time_base;

    if (_avcodec_open2(sc.audio_avcc.ptr, sc.audio_avc.ptr, NULL) < 0) {
      console.log("could not open the codec");
      return -1;
    }
    _avcodec_parameters_from_context(
      sc.audio_avs.codecpar.ptr,
      sc.audio_avcc.ptr
    );
    return 0;
  };

  const prepare_copy = (avfc, avs, decoder_par) => {
    avs.ptr = _avformat_new_stream(avfc.ptr, NULL);
    _avcodec_parameters_copy(avs.codecpar.ptr, decoder_par.ptr);
    return 0;
  };

  const remux = (pkt, avfc, decoder_tb, encoder_tb) => {
    __av_packet_rescale_ts(pkt.ptr, decoder_tb.ptr, encoder_tb.ptr);
    if (_av_interleaved_write_frame(avfc.ptr, pkt.ptr) < 0) {
      console.log("error while copying stream packet");
      return -1;
    }
    return 0;
  };

  const encode_video = (decoder, encoder, input_frame) => {
    if (input_frame.ptr) {
      input_frame.pict_type = AV_PICTURE_TYPE_NONE;
    }

    const output_packet = new AVPacket(_av_packet_alloc());
    if (!output_packet) {
      console.log("could not allocate memory for output packet");
      return -1;
    }

    let response = _avcodec_send_frame(encoder.video_avcc.ptr, input_frame.ptr);

    while (response >= 0) {
      response = _avcodec_receive_packet(
        encoder.video_avcc.ptr,
        output_packet.ptr
      );

      if (response === AVERROR_EAGAIN || response === AVERROR_EOF) {
        break;
      } else if (response < 0) {
        console.log("Error while receiving packet from encoder", response);
        return response;
      }

      output_packet.stream_index = decoder.video_index;
      output_packet.duration =
        (encoder.video_avs.time_base.den /
          encoder.video_avs.time_base.num /
          decoder.video_avs.avg_frame_rate.num) *
        decoder.video_avs.avg_frame_rate.den;

      __av_packet_rescale_ts(
        output_packet.ptr,
        decoder.video_avs.time_base.ptr,
        encoder.video_avs.time_base.ptr
      );
      response = _av_interleaved_write_frame(
        encoder.avfc.ptr,
        output_packet.ptr
      );
      if (response != 0) {
        console.log("Error while receiving packet from decoder", response);
        return -1;
      }
    }
    _av_packet_unref(output_packet.ptr);
    _av_packet_free(ref(output_packet.ptr));
    return 0;
  };

  const encode_audio = (decoder, encoder, input_frame) => {
    const output_packet = new AVPacket(_av_packet_alloc());
    if (!output_packet) {
      console.log("could not allocate memory for output packet");
      return -1;
    }

    let response = _avcodec_send_frame(encoder.audio_avcc.ptr, input_frame.ptr);

    while (response >= 0) {
      response = _avcodec_receive_packet(
        encoder.audio_avcc.ptr,
        output_packet.ptr
      );

      if (response === AVERROR_EAGAIN || response === AVERROR_EOF) {
        break;
      } else if (response < 0) {
        console.log("Error while receiving packet from encoder", response);
        return response;
      }

      output_packet.stream_index = decoder.audio_index;

      __av_packet_rescale_ts(
        output_packet.ptr,
        decoder.audio_avs.time_base.ptr,
        encoder.audio_avs.time_base.ptr
      );
      response = _av_interleaved_write_frame(
        encoder.avfc.ptr,
        output_packet.ptr
      );
      if (response != 0) {
        console.log("Error while receiving packet from decoder", response);
        return -1;
      }
    }
    _av_packet_unref(output_packet.ptr);
    _av_packet_free(ref(output_packet.ptr));
    return 0;
  };

  const transcode_audio = (decoder, encoder, input_packet, input_frame) => {
    let response = _avcodec_send_packet(
      decoder.audio_avcc.ptr,
      input_packet.ptr
    );
    if (response < 0) {
      console.log("Error while sending packet to decoder", response);
      return response;
    }

    while (response >= 0) {
      response = _avcodec_receive_frame(
        decoder.audio_avcc.ptr,
        input_frame.ptr
      );

      if (response === AVERROR_EAGAIN || response === AVERROR_EOF) {
        break;
      } else if (response < 0) {
        console.log("Error while receiving frame from decoder", response);
        return response;
      }

      if (response >= 0) {
        if (encode_audio(decoder, encoder, input_frame)) return -1;
      }
      _av_frame_unref(input_frame.ptr);
    }
    return 0;
  };

  const transcode_video = (decoder, encoder, input_packet, input_frame) => {
    let response = _avcodec_send_packet(
      decoder.video_avcc.ptr,
      input_packet.ptr
    );
    if (response < 0) {
      console.log("Error while sending packet to decoder", response);
      return response;
    }

    while (response >= 0) {
      response = _avcodec_receive_frame(
        decoder.video_avcc.ptr,
        input_frame.ptr
      );

      if (response === AVERROR_EAGAIN || response === AVERROR_EOF) {
        break;
      } else if (response < 0) {
        console.log("Error while receiving frame from decoder", response);
        return response;
      }

      if (response >= 0) {
        if (encode_video(decoder, encoder, input_frame)) return -1;
      }
      _av_frame_unref(input_frame.ptr);
    }
    return 0;
  };

  const main = () => {
    const [, , iFilePath, oFilePath] = argv;

    if (!iFilePath || !oFilePath) {
      console.log("Usage: node transcode.js <IN_FILE_PATH> <OUT_FILE_PATH>");
      exit(1);
    }

    const iFileName = basename(iFilePath);
    const media = Uint8Array.from(readFileSync(iFilePath));

    writeFile(iFileName, media);

    const oFileName = basename(oFilePath);

    const sp = new StreamingParams();
    sp.copy_audio = 1;
    sp.copy_video = 0;
    sp.video_codec = stringToPtr("libx264");
    sp.codec_priv_key = stringToPtr("x264-params");
    sp.codec_priv_value = stringToPtr(
      "keyint=60:min-keyint=60:scenecut=0:force-cfr=1"
    );

    const decoder = new StreamingContext();
    decoder.filename = stringToPtr(iFileName);

    const encoder = new StreamingContext();
    encoder.filename = stringToPtr(oFileName);

    if (open_media(iFileName, decoder.avfc)) return -1;
    if (prepare_decoder(decoder)) return -1;

    let ptr = ref(encoder.avfc.ptr);
    _avformat_alloc_output_context2(ptr, NULL, NULL, encoder.filename);
    encoder.avfc.ptr = deref(ptr);
    if (!encoder.avfc.ptr) {
      console.log("could not allocate memory for output format");
      return -1;
    }

    if (!sp.copy_video) {
      const input_framerate = __av_guess_frame_rate(
        decoder.avfc.ptr,
        decoder.video_avs.ptr,
        NULL
      );
      prepare_video_encoder(encoder, decoder.video_avcc, input_framerate, sp);
    } else {
      if (
        prepare_copy(
          encoder.avfc,
          encoder.video_avs,
          decoder.video_avs.codecpar
        )
      )
        return -1;
    }

    if (!sp.copy_audio) {
      if (prepare_audio_encoder(encoder, decoder.audio_avcc.sample_rate, sp)) {
        return -1;
      }
    } else {
      if (
        prepare_copy(
          encoder.avfc,
          encoder.audio_avs,
          decoder.audio_avs.codecpar
        )
      ) {
        return -1;
      }
    }

    if (encoder.avfc.oformat.flags & AVFMT_GLOBALHEADER) {
      encoder.avfc.flags |= AV_CODEC_FLAG_GLOBAL_HEADER;
    }

    if (!(encoder.avfc.oformat.flags & AVFMT_NOFILE)) {
      const ptr = ref(encoder.avfc.pb.ptr);
      if (_avio_open(ptr, encoder.filename, AVIO_FLAG_WRITE) < 0) {
        console.log("could not open the output file");
        return -1;
      }
      encoder.avfc.pb = new AVIOContext(deref(ptr));
    }

    const muxer_opts = new AVDictionary(NULL);

    if (sp.muxer_opt_key && sp.muxer_opt_value) {
      const ptr = ref(muxer_opts.ptr);
      _av_dict_set(ptr, sp.muxer_opt_key, sp.muxer_opt_value, 0);
      muxer_opts.ptr = deref(ptr);
    }

    ptr = ref(muxer_opts.ptr);
    if (_avformat_write_header(encoder.avfc.ptr, ptr) < 0) {
      console.log("an error occurred when opening output file");
      return -1;
    }
    muxer_opts.ptr = deref(ptr);

    const input_frame = new AVFrame(_av_frame_alloc());
    if (!input_frame.ptr) {
      console.log("failed to allocate memory for AVFrame");
      return -1;
    }
    const input_packet = new AVPacket(_av_packet_alloc());
    if (!input_packet.ptr) {
      console.log("failed to allocate memory for AVPacket");
      return -1;
    }

    console.log("start to transcode");
    console.time("transcode");
    while (_av_read_frame(decoder.avfc.ptr, input_packet.ptr) >= 0) {
      if (
        decoder.avfc.nth_stream(input_packet.stream_index).codecpar
          .codec_type === AVMEDIA_TYPE_VIDEO
      ) {
        if (!sp.copy_video) {
          if (transcode_video(decoder, encoder, input_packet, input_frame))
            return -1;
          _av_packet_unref(input_packet.ptr);
        } else {
          if (
            remux(
              input_packet,
              encoder.avfc,
              decoder.video_avs.time_base,
              encoder.video_avs.time_base
            )
          )
            return -1;
        }
      } else if (
        decoder.avfc.nth_stream(input_packet.stream_index).codecpar
          .codec_type === AVMEDIA_TYPE_AUDIO
      ) {
        if (!sp.copy_audio) {
          if (transcode_audio(decoder, encoder, input_packet, input_frame))
            return -1;
          _av_packet_unref(input_packet.ptr);
        } else {
          if (
            remux(
              input_packet,
              encoder.avfc,
              decoder.audio_avs.time_base,
              encoder.audio_avs.time_base
            )
          )
            return -1;
        }
      } else {
        console.log("ignore all non video or audio packets");
      }
    }

    if (encode_video(decoder, encoder, NULL)) return -1;
    console.timeEnd("transcode");

    _av_write_trailer(encoder.avfc.ptr);

    console.log(`write output file to ${oFilePath}`);
    writeFileSync(oFilePath, readFile(oFileName));

    // TODO: free resources.

    return 0;
  };

  main();
})();
