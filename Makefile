all: dev

CFLAGS := -O3 -msimd128
CACHE_ARGS := --cache-from=type=local,src=build-cache --cache-to=type=local,dest=build-cache,mode=max

copy-files:
	cp ./src/libav.d.ts ./packages/libav-core/dist/

build:
	EXTRA_CFLAGS="$(EXTRA_CFLAGS)" \
		bash build.sh --build-arg EXTRA_CFLAGS $(ARGS)
	make copy-files

dev:
	make build ARGS="--progress plain"

prd:
	make build EXTRA_CFLAGS="$(CFLAGS)"

ci:
	make build EXTRA_CFLAGS="$(CFLAGS)" ARGS="$(CACHE_ARGS)"
