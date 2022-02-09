export default [
  {
    path: "/news/",
    name: "News List",
    component: () => import("@/views/news/")
  },
  {
    path: "/news/create",
    name: "Create News",
    component: () => import("@/views/news/CreateNews")
  },
  {
    path: "/news/edit",
    name: "Edit News",
    component: () => import("@/views/news/EditNews")
  },
  {
    path: "/news/view",
    name: "View News",
    component: () => import("@/views/news/ViewNews")
  },
  {
    path: "/my-tasks",
    name: "My Tasks",
    component: () => import("@/views/news/NewsTask")
  },
  // International News
  {
    path: "/news/international-news",
    name: "International News",
    component: () => import("@/views/news/international-news/")
  },
  {
    path: "/news/international-news/review",
    name: "Review - International News",
    component: () => import("@/views/news/international-news/ReviewNews")
  },
  {
    path: "/news/international-news/daily-news",
    name: "International Daily News",
    component: () => import("@/views/news/international-news/DailyNews")
  },
  {
    path: "/news/international-news/list-for-approve",
    name: "International Daily News - Approve List",
    component: () =>
      import("@/views/news/international-news/NewsListForApprove")
  },
  {
    path: "/news/international-news/approve-news",
    name: "International Daily News - Approve",
    component: () => import("@/views/news/international-news/ApproveNews")
  },
  {
    path: "/news/international-news/edit-merge-news",
    name: "International Daily News - Edit Merge News",
    component: () => import("@/views/news/international-news/EditMergeNews")
  },
  {
    path: "/news/international-news/fill-detail-news",
    name: "International Daily News - Fill Detail News",
    component: () => import("@/views/news/international-news/FillDetailNews")
  },
  {
    path: "/news/international-news/CheckNews",
    name: "International Daily News - Check News",
    component: () => import("@/views/news/international-news/CheckNews")
  },
  {
    path: "/news/international-news/EditWritingNews",
    name: "International Daily News - Edit Writing News",
    component: () => import("@/views/news/international-news/EditWritingNews")
  },
  // Local News
  {
    path: "/news/local-news",
    name: "Local News",
    component: () => import("@/views/news/local-news/")
  },

  {
    path: "/news/local-news/review",
    name: "Review - Local News",
    component: () => import("@/views/news/local-news/ReviewNews")
  },
  {
    path: "/news/local-news/daily-news",
    name: "Local Daily News",
    component: () => import("@/views/news/local-news/DailyNews")
  },
  {
    path: "/news/local-news/list-for-approve",
    name: "Local Daily News - Approve List",
    component: () => import("@/views/news/local-news/NewsListForApprove")
  },
  {
    path: "/news/local-news/approve-news",
    name: "Local Daily News - Approve",
    component: () => import("@/views/news/local-news/ApproveNews")
  },
  {
    path: "/news/local-news/edit-merge-news",
    name: "Local Daily News - Edit Merge News",
    component: () => import("@/views/news/local-news/EditMergeNews")
  },
  {
    path: "/news/local-news/fill-detail-news",
    name: "Local Daily News - Fill Detail News",
    component: () => import("@/views/news/local-news/FillDetailNews")
  },
  {
    path: "/news/local-news/CheckNews",
    name: "Local Daily News - Check News",
    component: () => import("@/views/news/local-news/CheckNews")
  },
  {
    path: "/news/local-news/EditWritingNews",
    name: "Local Daily News - Edit Writing News",
    component: () => import("@/views/news/local-news/EditWritingNews")
  },

  // Cyber News
  {
    path: "/news/cyber-news",
    name: "Cyber News",
    component: () => import("@/views/news/cyber-news/")
  },

  {
    path: "/news/cyber-news/review",
    name: "Review - Cyber News",
    component: () => import("@/views/news/cyber-news/ReviewNews")
  },
  {
    path: "/news/cyber-news/daily-news",
    name: "Cyber Daily News",
    component: () => import("@/views/news/cyber-news/DailyNews")
  },
  {
    path: "/news/cyber-news/list-for-approve",
    name: "Cyber Daily News - Approve List",
    component: () => import("@/views/news/cyber-news/NewsListForApprove")
  },
  {
    path: "/news/cyber-news/approve-news",
    name: "Cyber Daily News - Approve",
    component: () => import("@/views/news/cyber-news/ApproveNews")
  },
  {
    path: "/news/cyber-news/edit-merge-news",
    name: "Cyber Daily News - Edit Merge News",
    component: () => import("@/views/news/cyber-news/EditMergeNews")
  },
  {
    path: "/news/cyber-news/fill-detail-news",
    name: "Cyber Daily News - Fill Detail News",
    component: () => import("@/views/news/cyber-news/FillDetailNews")
  },
  {
    path: "/news/cyber-news/CheckNews",
    name: "Cyber Daily News - Check News",
    component: () => import("@/views/news/cyber-news/CheckNews")
  },
  {
    path: "/news/cyber-news/EditWritingNews",
    name: "Cyber Daily News - Edit Writing News",
    component: () => import("@/views/news/cyber-news/EditWritingNews")
  },

  //setting
  {
    path: "/rank",
    name: "rank",
    component: () => import("@/views/news/Rank")
  },
  {
    path: "/operator",
    name: "operator",
    component: () => import("@/views/news/operator/Operator")
  },
  {
    path: "/operator/view/:processId",
    name: "operator view",
    component: () => import("@/views/news/operator/view")
  },
  {
    path: "/myTaskStatus/",
    name: "My Task Status",
    component: () => import("@/views/news/MyTaskStatus/MyTaskStatus")
  },
  {
    path: "/myTaskStatusNewsView/",
    name: "My Task Status - News View",
    component: () => import("@/views/news/MyTaskStatus/MyTaskStatusNewsView")
  },
  {
    path: "/myTaskStatusDailyNewsView/:processId",
    name: "My Task Status - Daily News View",
    component: () =>
      import("@/views/news/MyTaskStatus/MyTaskStatusDailyNewsView")
  },

  {
    path: "/allTaskStatus/",
    name: "All Task Status",
    component: () => import("@/views/news/AllTaskStatus/AllTaskStatus")
  },
  {
    path: "/allTaskStatusNewsView/",
    name: "All Task Status - News View",
    component: () => import("@/views/news/AllTaskStatus/AllTaskStatusNewsView")
  },
  {
    path: "/allTaskStatusDailyNewsView/",
    name: "All Task Status - Daily News View",
    component: () => import("@/views/news/AllTaskStatus/AllTaskStatusDailyNewsView")
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/news/test")
  }

  // Publish News
  // {
  //   path: '/news/:processId',
  //   name: 'Read News',
  //   component: () => import('@/views/news/PublishNews')
  // }
];
