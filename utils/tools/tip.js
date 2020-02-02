const chalk = require('chalk')
const spinner = require('ora')()
exports.error = function(t, isExit = true) {
  spinner.fail(chalk.red(t))
  isExit && process.exit()
}
exports.success = function(t, isExit) {
  spinner.succeed(chalk.green(t))
  isExit && process.exit()
}
exports.warning = function(t, isExit) {
  spinner.warn(chalk.yellow(t))
  isExit && process.exit()
}
exports.info = function(t, isExit) {
  spinner.info(chalk.blue(t))
  isExit && process.exit()
}
exports.log = function(t) {
  console.log(chalk.green(t))
}
exports.clearLog = function() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')
}