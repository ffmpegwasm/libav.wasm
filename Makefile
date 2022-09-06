all: dev

VERBOSE_ARGS := --progress plain
CFLAGS := -O3 -msimd128
CACHE_ARGS := --cache-from=type=local,src=build-cache --cache-to=type=local,dest=build-cache,mode=max

build:
	EXTRA_CFLAGS="$(EXTRA_CFLAGS)" \
		bash build$(SUFFIX).sh --build-arg EXTRA_CFLAGS $(ARGS)

build-mt:
	make build SUFFIX="-mt"

dev:
	make build ARGS="$(VERBOSE_ARGS)"

dev-mt:
	make build-mt ARGS="$(VERBOSE_ARGS)"

prd:
	make build EXTRA_CFLAGS="$(CFLAGS)"

prd-mt:
	make build-mt EXTRA_CFLAGS="$(CFLAGS)"

ci:
	make build EXTRA_CFLAGS="$(CFLAGS)" ARGS="$(CACHE_ARGS)"

ci-mt:
	make build-mt EXTRA_CFLAGS="$(CFLAGS)" ARGS="$(CACHE_ARGS)"
