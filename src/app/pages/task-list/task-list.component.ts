import { Component, OnInit } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { NgFor, NgIf } from '@angular/common';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TaskFilterComponent } from '../../components/task-filter/task-filter.component';

@Component({
  selector: 'app-task-list',
  imports: [NgIf, TaskCardComponent, NgFor, TaskFilterComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = []
  loading = true

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks()
  }

  loadTasks(title = "", status: TaskStatus | "" = ""): void {
    this.loading = true
    this.taskService.filterTasks(title, status).subscribe((tasks) => {
      this.tasks = tasks
      this.loading = false
    })
  }

  onFilterChange(filters: { title: string; status: TaskStatus | "" }): void {
    this.loadTasks(filters.title, filters.status)
  }

  onDeleteTask(id: number): void {
    if (confirm("Are you sure you want to delete this task?")) {
      console.log('need delete id ', id);
      
    }
  }
}
