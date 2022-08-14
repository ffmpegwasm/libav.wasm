#!/bin/bash

docker buildx build \
	$@ \
	-o . \
	.
