import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [RouterLink, NgClass, DatePipe],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  @Input() task!: Task
  @Output() delete = new EventEmitter<string>()

  onDelete(): void {
    this.delete.emit(this.task.taskId)
  }

  getStatusClass(): string {
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
}
