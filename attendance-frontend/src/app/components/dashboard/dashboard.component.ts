import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  attendanceLogs: any[] = [];
  errorMessage = '';
  successMessage = '';
  isCheckingIn = false;
  isCheckingOut = false;

  constructor(
    private authService: AuthService,
    private attendanceService: AttendanceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser = this.authService.getUser();
    this.loadAttendanceLogs();
  }

  loadAttendanceLogs(): void {
    this.attendanceService.getMyAttendance().subscribe({
      next: data => {
        this.attendanceLogs = data;
        this.errorMessage = '';
      },
      error: err => {
        this.errorMessage = this.getErrorMessage(err, 'Failed to load attendance logs');
      }
    });
  }

  checkIn(): void {
    this.isCheckingIn = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.attendanceService.checkIn().subscribe({
      next: () => {
        this.isCheckingIn = false;
        this.successMessage = 'Checked in successfully!';
        this.loadAttendanceLogs();
      },
      error: err => {
        this.errorMessage = this.getErrorMessage(err, 'Failed to check in');
        this.isCheckingIn = false;
      }
    });
  }

  checkOut(): void {
    this.isCheckingOut = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.attendanceService.checkOut().subscribe({
      next: () => {
        this.isCheckingOut = false;
        this.successMessage = 'Checked out successfully!';
        this.loadAttendanceLogs();
      },
      error: err => {
        this.errorMessage = this.getErrorMessage(err, 'Failed to check out');
        this.isCheckingOut = false;
      }
    });
  }

  private getErrorMessage(err: any, fallback: string): string {
    if (typeof err.error === 'string') return err.error;
    if (err.error?.message) return err.error.message;
    if (err.message) return err.message;
    return fallback;
  }

  logout(): void {
    window.sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
