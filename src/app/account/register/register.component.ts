import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      controls: {
        username: ['', [Validators.required]],
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
      },
      options: { validator: this.passwordMatchValidator }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return; // Prevent submission if form is invalid
    }

    this.isLoading = true;
    this.accountService.register(this.registerForm.value)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/login']); // Redirect to login after successful registration
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message; // Display error message
        }
      });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    return password?.value !== confirmPassword?.value ? { passwordMismatch: true } : null;
  }
}
