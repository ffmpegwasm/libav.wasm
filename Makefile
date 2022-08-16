all: build

build:
	bash build.sh

run-metadata:
	node example/metadata.mjs testdata/video-1s.mp4

run-transcode:
	node example/transcode.mjs testdata/video-1s.avi video-1s.mp4
