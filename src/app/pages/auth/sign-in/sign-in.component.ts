import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {
  signInForm: FormGroup
  loading = false
  submitted = false
  error = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signInForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })
  }

  get f() {
    return this.signInForm.controls
  }

  onSubmit(): void {
    this.submitted = true
    this.error = ""

    // Stop if form is invalid
    if (this.signInForm.invalid) {
      return
    }

    this.loading = true
    this.authService.login(this.signInForm.value.email, this.signInForm.value.password).subscribe({
      next: () => {
        this.router.navigate(["/tasks"])
      },
      error: (error) => {
        this.error = error.message
        this.loading = false
      },
    })
  }
}
