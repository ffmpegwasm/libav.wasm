all: build

build:
	bash build.sh

run-get-metadata:
	node example/get-metadata.mjs testdata/video-1s.mp4
