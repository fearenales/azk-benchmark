module.exports = {

  // This actions will be executed before mais actions as a cleanup job
  // This is used to make main actions faster
  pre_actions: [
    [ ['agent'], ['start'], ['--no-color'] ],
    [ ['start'], ['-Rvv'], ['--no-color'] ],
    [ ['stop'], ['-vv'], ['--no-color'] ],
    [ ['docker'], ['--no-color'], ['--'], ['pull'], ['azukiapp/node:4.2.1'] ],
    [ ['docker'], ['--no-color'], ['--'], ['pull'], ['redis:3.0.6'] ],
    [ ['agent'], ['stop'], ['--no-color'] ],
  ],

  // All actions here will be benchmarked
  main_actions: [
    [ ['agent'], ['start'], ['--no-color'] ],
    [ ['version'], ['--no-color'] ],
    [ ['docker'], ['--no-color'], ['--'], ['version'] ],
    [ ['docker'], ['--no-color'], ['--'], ['info'] ],
    [ ['info'], ['--no-color'] ],
    [ ['start'], ['--no-color'] ],
    [ ['status'], ['--no-color'] ],
    [ ['stop'], ['--no-color'] ],
    [ ['agent'], ['stop'], ['--no-color'] ],
  ]
};
