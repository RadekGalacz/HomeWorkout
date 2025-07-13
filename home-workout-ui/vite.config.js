import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/projects/home-workout/", //Pro build na můj web
  plugins: [react()],
  server: {
    proxy: {
      "/Users": {
        target: "https://homeworkoutwebapp.runasp.net",
        changeOrigin: true,
        secure: false,
      },
      "/exercises": {
        target: "https://homeworkoutwebapp.runasp.net",
        changeOrigin: true,
        secure: false,
      },
      "/BodyParts": {
        target: "https://homeworkoutwebapp.runasp.net",
        changeOrigin: true,
        secure: false,
      },
      "/WorkoutPlan": {
        target: "https://homeworkoutwebapp.runasp.net",
        changeOrigin: true,
        secure: false,
      },
      "/WorkoutExercise": {
        target: "https://homeworkoutwebapp.runasp.net",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

//NASTAVENÍ PRO LOCAL:

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//             "/Roles": {
//         target: "https://localhost:44341",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/Account": {
//         target: "https://localhost:44341",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/Login": {
//         target: "https://localhost:44341",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/Users": {
//         target: "https://localhost:44341",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/exercises": {
//         target: "https://localhost:44341",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/BodyParts": {
//         target: "https://localhost:44341",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/WorkoutPlan": {
//         target: "https://localhost:44341",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/WorkoutExercise": {
//         target: "https://localhost:44341",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });
