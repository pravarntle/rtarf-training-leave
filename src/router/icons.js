export default [
  {
    path: '/icons/coreui-icons',
    name: 'CoreUI Icons',
    component: () => import('@/views/icons/CoreUIIcons')
  },
  {
    path: '/icons/flags',
    name: 'Flags',
    component: () => import('@/views/icons/Brands')
  },
  {
    path: '/icons/brands',
    name: 'Brands',
    component: () => import('@/views/icons/Flags')
  }
]
