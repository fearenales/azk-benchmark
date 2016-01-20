import BB from 'bluebird';
import which from 'which';

let whichHelper = (command_path) => {
  return new BB.Promise((resolve, reject) => {
    which(command_path, (err, resolvedPath) => {
      if (err) {
        // er is returned if no "command_path" is found on the PATH
        err = new Error(`'${command_path}' not found in PATH: ${process.env.PATH}`);
        err.stack = undefined;
        reject(err);
      } else {
        // if it is found, then the absolute path to the exec is returned
        resolve(resolvedPath);
      }
    });
  });
};

export default whichHelper;
