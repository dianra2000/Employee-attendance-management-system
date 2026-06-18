import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:8080/api/attendance/';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  checkIn(): Observable<any> {
    return this.http.post(API_URL + 'check-in', {}, { headers: this.getHeaders() });
  }

  checkOut(): Observable<any> {
    return this.http.post(API_URL + 'check-out', {}, { headers: this.getHeaders() });
  }

  getMyAttendance(): Observable<any> {
    return this.http.get(API_URL + 'my-attendance', { headers: this.getHeaders() });
  }
}
