/** @type {import('@glcc/admin').ProjectConfig} */
module.exports = {
  doctor: false,
  federation: [
    {
      name: 'remote',
      layout: true,
      entry: 'http://localhost:3001',
    },
    // {
    //   name: 'common',
    //   entry: 'http://172.16.200.27:8003',
    // },
    {
      name: 'remoteTest',
      layout: true,
      entry: 'http://localhost:3002',
    },
  ],
}
