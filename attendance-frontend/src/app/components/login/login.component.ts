import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: any = {
    username: '',
    password: ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService.login(this.form).subscribe({
      next: data => {
        this.authService.saveToken(data.token);
        this.authService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.errorMessage = err.error.message || 'Login failed! Please check your credentials.';
        this.isLoginFailed = true;
        this.isLoading = false;
      }
    });
  }
}
