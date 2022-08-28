all: dev

dev:
	bash build.sh --progress plain

prd:
	EXTRA_CFLAGS="-O3 -msimd128" \
		bash build.sh --build-arg EXTRA_CFLAGS --build-arg EXTRA_LDFLAGS

run-metadata:
	node example/metadata.mjs testdata/video-1080p-60fps-2s.mp4

run-transcode:
	node example/transcode.mjs testdata/video-1080p-60fps-2s.mp4 output.mp4
