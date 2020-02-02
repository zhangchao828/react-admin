#!/usr/bin/env node
const script = process.argv[2]
const { setEnv } = require('../utils/tools/env')
const { error } = require('../utils/tools/tip')
setEnv(process.argv)
if (['start', 'build', 'update'].includes(script)) {
  require('../scripts/' + script)(process.argv)
} else {
  error(`Unknown script ${script}. `)
}
