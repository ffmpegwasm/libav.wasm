#!/bin/bash

docker buildx build \
	-f Dockerfile.mt \
	$@ \
	-o packages/libav-core-mt \
	.
