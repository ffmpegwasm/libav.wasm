all: build

build:
	bash build.sh --progress plain

run-metadata:
	node example/metadata.mjs testdata/video-1080p-60fps-2s.mp4

run-transcode:
	node example/transcode.mjs testdata/video-1080p-60fps-2s.mp4 output.mp4
