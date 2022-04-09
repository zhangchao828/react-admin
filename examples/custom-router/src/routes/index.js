module.exports = [
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
]
