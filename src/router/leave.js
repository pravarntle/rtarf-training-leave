export default [
  {
    path: `/leave/form`,
    name: "Leave Form",
    component: () => import("@/views/leave/LeaveForm"),
  },
  {
    path: `/leave/list`,
    name: "Leave List",
    component: () => import("@/views/leave/LeaveList"),
  },
  {
    path: `/leave/my-leave`,
    name: "My Leave",
    component: () => import("@/views/leave/MyLeave"),
  },
]