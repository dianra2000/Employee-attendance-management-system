import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password,
      fullName: user.fullName,
      employeeId: user.employeeId,
      department: user.department
    }, httpOptions);
  }

  saveToken(token: string): void {
    window.sessionStorage.removeItem('auth-token');
    window.sessionStorage.setItem('auth-token', token);
  }

  getToken(): string | null {
    return window.sessionStorage.getItem('auth-token');
  }

  saveUser(user: any): void {
    window.sessionStorage.removeItem('auth-user');
    window.sessionStorage.setItem('auth-user', JSON.stringify(user));
  }

  getUser(): any {
    const user = window.sessionStorage.getItem('auth-user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem('auth-user');
    return user ? true : false;
  }
}
