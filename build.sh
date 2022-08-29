#!/bin/bash

docker buildx build \
	$@ \
	-o ./packages/libav-core \
	.
