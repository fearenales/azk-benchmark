# azk-benchmark

> azk's benchmarking tool

## Features

- Choose which `azk version` to use.
- Uses azkdemo as default project but this is configurable
- Provision execution
- Benchmarks several azk commands
- Can send all results to some Keen.IO repo

### Install

```sh
npm install azk-benchmark -g
```

### Run

```sh
  $ azk-benchmark             # will run with default azk binary
  $ azk-benchmark azk         # will run with azk
  $ azk-benchmark azk --send  # run and send to Keen.IO

  # you can customize all configuration, like this:
  $ azk-benchmark azk --git-repo=azukiapp/azkdemo \
                      --dest-path=/tmp/azkdemo_benchmark \
                      --git-ref=benchmark  \
                      --send
```

### Configure Keen.IO keys

> You can also create a .env file

```sh
export BENCHMARK_AZK_KEEN_IO_PROJECTID=qweasd
export BENCHMARK_AZK_KEEN_IO_WRITEKEY=qweasd
```

### Test and run locally

```sh
npm test
node ./bin/azk-benchmark.js -h
```

