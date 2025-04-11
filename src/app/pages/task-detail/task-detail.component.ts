import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  imports: [NgIf,NgClass, DatePipe, RouterLink],
  templateUrl: './task-detail.component.html',
})
export class TaskDetailComponent implements OnInit {
  task?: Task
  loading = true

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get("id"))
    this.loadTask(id)
  }

  loadTask(id: string): void {
    this.taskService.getTaskById(id).subscribe((task) => {
      this.task = task
      this.loading = false
    })
  }

  getStatusClass(): string {
    if (!this.task) return ""

    switch (this.task.status) {
      case "TO_DO":
        return "bg-warning"
      case "IN_PROGRESS":
        return "bg-info"
      case "DONE":
        return "bg-success"
      default:
        return "bg-secondary"
    }
  }

  deleteTask(): void {
    if (!this.task) return

    if (confirm("Are you sure you want to delete this task?")) {
      this.taskService.deleteTask(this.task.taskId).subscribe({
        next: () => {
          this.router.navigate(["/tasks"])
          this.taskService.loadTasks()
        },
        error: (err : Error) => {
          alert(err.message || "Failed to delete task")
        },
      })
    }
  }

  editTask(): void {
    if (!this.task) return
    this.router.navigate(["/tasks"])
  }

  goBack(): void {
    this.router.navigate(["/tasks"])
  }
}
