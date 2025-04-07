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
  taskId?: number
  loading = false
  submitted = false

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm()

    this.taskId = Number(this.route.snapshot.paramMap.get("id"))
    if (this.taskId) {
      this.isEditMode = true
      // this.loadTask(this.taskId)
    }
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

  onSubmit(): void {
    this.submitted = true

    if (this.taskForm.invalid) {
      return
    }

    if (this.isEditMode && this.taskId) {
      console.log(this.taskId);
      
    } else {
      console.log(this.taskForm.value);
      
      this.taskService.addTask(this.taskForm.value)
    }

    this.router.navigate(["/tasks"])
  }
}

