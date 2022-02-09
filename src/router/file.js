export default [
  {
    path: `/files/:id`,
    name: "Files",
    component: () => import("@/views/file/File.vue"),
  },
];
