import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  attendanceLogs: any[] = [];
  errorMessage = '';
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
      },
      error: err => {
        this.errorMessage = err.error.message || 'Failed to load attendance logs';
      }
    });
  }

  checkIn(): void {
    this.isCheckingIn = true;
    this.attendanceService.checkIn().subscribe({
      next: data => {
        this.isCheckingIn = false;
        this.loadAttendanceLogs();
      },
      error: err => {
        this.errorMessage = err.error.message || 'Failed to check in';
        this.isCheckingIn = false;
      }
    });
  }

  checkOut(): void {
    this.isCheckingOut = true;
    this.attendanceService.checkOut().subscribe({
      next: data => {
        this.isCheckingOut = false;
        this.loadAttendanceLogs();
      },
      error: err => {
        this.errorMessage = err.error.message || 'Failed to check out';
        this.isCheckingOut = false;
      }
    });
  }

  logout(): void {
    this.authService.saveToken('');
    this.authService.saveUser(null);
    window.sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
