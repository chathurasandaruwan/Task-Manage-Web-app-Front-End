import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "signin",
    pathMatch: "full",
  },
  {
    path: "signin",
    loadComponent: () => import("./pages/auth/sign-in/sign-in.component").then((m) => m.SignInComponent),
  },
  {
    path: "signup",
    loadComponent: () => import("./pages/auth/sign-up/sign-up.component").then((m) => m.SignUpComponent),
  },
  {
    path: "tasks",
    loadComponent: () => import("./pages/task-list/task-list.component").then((m) => m.TaskListComponent),
  },
  {
    path: "tasks/new",
    loadComponent: () => import("./pages/task-form/task-form.component").then((m) => m.TaskFormComponent),
  },
  {
    path: "tasks/:id",
    loadComponent: () => import("./pages/task-detail/task-detail.component").then((m) => m.TaskDetailComponent),
  },
  {
    path: "tasks/:id/edit",
    loadComponent: () => import("./pages/task-form/task-form.component").then((m) => m.TaskFormComponent),
  },
  {
    path: "**",
    redirectTo: "signin",
  },
];
