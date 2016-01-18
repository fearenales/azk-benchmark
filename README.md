# azk-benchmark
azk's benchmarking

### install

```sh
npm install azk-benchmark -g
```

### run

```sh
azk-benchmark
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

