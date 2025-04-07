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
      this.loadTask(this.taskId)
    }
  }

  //load task to form to edit
  loadTask(id: number): void {
    this.loading = true
    this.taskService.getTaskById(id).subscribe((task) => {
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
        })
      } else {
        this.router.navigate(["/tasks"])
      }
      this.loading = false
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

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, this.taskForm.value)
      
    } else {
      // console.log(this.taskForm.value);
      this.taskService.addTask(this.taskForm.value)
    }

    this.router.navigate(["/tasks"])
  }
}

