#!/bin/bash

docker buildx build \
	-f Dockerfile.mt \
	$@ \
	-o . \
	.
