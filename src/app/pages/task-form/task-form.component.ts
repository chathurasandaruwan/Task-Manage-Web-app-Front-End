import { Component, type OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { TaskService } from "../../services/task.service"
import { NgClass, NgIf } from "@angular/common"

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup
  isEditMode = false
  taskId?: string
  loading = false
  submitted = false
  submitting = false
  error = ""

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm()

    const idParam = this.route.snapshot.paramMap.get("id")
if (idParam) {
  this.taskId = idParam
  
  this.isEditMode = true
  this.loadTask(this.taskId)
}
  }

  //load task to form to edit
  loadTask(id: string): void {
    this.loading = true
    this.error = ""
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        if (task) {
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            status: task.status,
          })
        } else {
          this.error = "Task not found"
          setTimeout(() => this.router.navigate(["/tasks"]), 3000)
        }
        this.loading = false
      },
      error: (err) => {
        this.error = err.message || "Failed to load task"
        this.loading = false
        setTimeout(() => this.router.navigate(["/tasks"]), 3000)
      },
    })
  }

  get f() {
    return this.taskForm.controls
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      status: ["TO_DO", Validators.required],
    })
  }
  
  //save and update 
  onSubmit(): void {
    this.submitted = true

    if (this.taskForm.invalid) {
      return
    }

    this.submitting = true
    this.error = ""

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, this.taskForm.value).subscribe({
        next: () => {
          this.router.navigate(["/tasks"])
          this.taskService.loadTasks()
        },
        error: (err : Error) => {
          this.error = err.message || "Failed to update task"
          this.submitting = false
        },
      })
    } else {
      this.taskService.addTask(this.taskForm.value).subscribe({
        next: () => {
          this.router.navigate(["/tasks"])
        },
        error: (err) => {
          this.error = err.message || "Failed to create task"
          this.submitting = false
        },
      })
    }
  }
  //go back
  goBack(): void {
    this.submitted = false
    this.router.navigate(["/tasks"])
  }
}

