const defineConfig = require('@zc/admin/define')
const common = require('../common.config')

module.exports = defineConfig({
  ...common,
  useFileRouter: false,
  routes:[
    {
      path: '/',
      component: 'index',
    },
    {
      path: '/home',
      component: 'home/layout',
      children: [
        {
          path: '/home',
          component: 'home/index',
        },
        {
          path: '/home/:id',
          component: 'home/id',
        },
        {
          path: '/home/detail',
          component: 'home/detail',
        },
      ],
    },
  ],
})
