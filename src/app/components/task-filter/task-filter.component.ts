import { Component, EventEmitter, Output } from '@angular/core';
import { TaskStatus } from '../../models/task.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './task-filter.component.html',
})
export class TaskFilterComponent {
  @Output() filter = new EventEmitter<{ title: string; status: TaskStatus | "" }>()

  filterForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      title: [""],
      status: [""],
    })
  }

  applyFilter(): void {
    this.filter.emit(this.filterForm.value)
  }

  resetFilter(): void {
    this.filterForm.reset({
      title: "",
      status: "",
    })
    this.filter.emit(this.filterForm.value)
  }
}
