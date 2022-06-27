const isDev = process.env.NODE_ENV === 'development'
const env = process.env.admin_env
const command = process.env.admin_command

module.exports = {
  isDev,
  env,
  command,
  define: {
    __ENV__: JSON.stringify(env),
    __MODE__: JSON.stringify(isDev ? 'start' : 'build'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
}
