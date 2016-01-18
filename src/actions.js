module.exports = {

  // This actions will be executed before main actions
  pre_actions: [
    () => [ ['agent'], ['start'], ['--no-color'] ],
    (opts) => [
      ['start'],
      [opts.git_repo],
      [opts.dest_path],
      ['--git-ref'],
      [opts.git_ref],
      ['--no-color'],
      ['-BR']
    ],
    () => [ ['stop'], ['-vv'], ['--no-color'] ],
    () => [ ['agent'], ['stop'], ['--no-color'] ],
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
