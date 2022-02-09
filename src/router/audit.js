export default [
  {
    path: `/file-report`,
    name: "Files Report",
    component: () => import("@/views/audit/Files-Report.vue"),
  },
  {
    path: `/user-report`,
    name: "User Report",
    component: () => import("@/views/audit/Users-Report.vue"),
  },
  {
    path: '/category-report',
    name: 'Report by Category',
    component: () => import('@/views/audit/CategoryReport')
  },
];
