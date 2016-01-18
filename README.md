# azk-benchmark

azk's benchmarking

### install

```sh
npm install azk-benchmark -g
```

### run

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

### configure Keen.IO keys

> You can also create a .env file

```sh
export BENCHMARK_AZK_KEEN_IO_PROJECTID=qweasd
export BENCHMARK_AZK_KEEN_IO_WRITEKEY=qweasd
```

### test and run locally

```sh
npm test
node ./bin/azk-benchmark.js -h
```

