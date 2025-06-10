import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment.prod';

interface LoginResponse { token: string; expires: string; }
interface DecodedToken { sub: string; role: string | string[]; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { username, password });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string {
  const token = this.getToken();
  if (!token) return '';

  const decoded: any = jwtDecode(token);

  const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  if (decoded[roleClaim]) {
    return Array.isArray(decoded[roleClaim]) ? decoded[roleClaim][0] : decoded[roleClaim];
  }

  // fallback if role claim is missing
  return '';
  }


}
