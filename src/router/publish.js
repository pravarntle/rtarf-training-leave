export default [
  {
    path: '/news/:processId',
    name: 'Read News',
    component: () => import('@/views/news/PublishNews')
  },
]