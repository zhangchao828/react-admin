const chokidar = require('chokidar')

function watchFiles(paths, options, callback) {
  let { event = ['add', 'addDir', 'unlink', 'unlinkDir'], ...restOptions } = options
  const witcher = chokidar.watch(paths, {
    ignoreInitial: true,
    ...restOptions,
  })
  if (typeof event === 'string') {
    event = [event || 'all']
  }
  if (!Array.isArray(event)) {
    event = ['all']
  }
  if (event.includes('all')) {
    witcher.on('all', callback)
  } else {
    event.forEach((type) => {
      witcher.on(type, (f, s) => callback(type, f, s))
    })
  }
}
module.exports = watchFiles
