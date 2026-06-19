import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:8080/api/leave/';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  applyLeave(leaveData: any): Observable<any> {
    return this.http.post(API_URL + 'apply', leaveData, { headers: this.getHeaders() });
  }

  getMyLeaves(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + 'my-leaves', { headers: this.getHeaders() });
  }
}
