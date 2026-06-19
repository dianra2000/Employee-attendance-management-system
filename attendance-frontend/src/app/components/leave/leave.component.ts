import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.css'
})
export class LeaveComponent implements OnInit {
  currentUser: any;
  leaveHistory: any[] = [];
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  leaveForm = {
    leaveType: 'ANNUAL',
    startDate: '',
    endDate: '',
    reason: ''
  };

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser = this.authService.getUser();
    this.loadLeaveHistory();
  }

  loadLeaveHistory(): void {
    this.leaveService.getMyLeaves().subscribe({
      next: data => {
        this.leaveHistory = data;
      },
      error: err => {
        this.errorMessage = this.getErrorMessage(err, 'Failed to load leave history');
      }
    });
  }

  submitLeave(): void {
    if (!this.leaveForm.startDate || !this.leaveForm.endDate || !this.leaveForm.reason) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    if (this.leaveForm.endDate < this.leaveForm.startDate) {
      this.errorMessage = 'End date cannot be before start date.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.leaveService.applyLeave(this.leaveForm).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Leave application submitted successfully!';
        this.leaveForm = { leaveType: 'ANNUAL', startDate: '', endDate: '', reason: '' };
        this.loadLeaveHistory();
      },
      error: err => {
        this.errorMessage = this.getErrorMessage(err, 'Failed to submit leave application');
        this.isSubmitting = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      default: return 'status-pending';
    }
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
