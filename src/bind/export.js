const EXPORTED_FUNCTIONS = [
  "_avformat_alloc_context",
  "_avformat_free_context",
  "_avformat_open_input",
  "_avformat_find_stream_info",
  "_avcodec_find_decoder",
  "_avcodec_alloc_context3",
  "_avcodec_parameters_to_context",
  "_avcodec_open2",
  "_avformat_alloc_output_context2",
];

console.log(EXPORTED_FUNCTIONS.join(","));
