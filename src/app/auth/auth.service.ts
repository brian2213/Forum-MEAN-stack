import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './models/auth-models';
import { Subject } from '../../../node_modules/rxjs';
import { Router } from '../../../node_modules/@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuth = false;
  private tokenTimer: NodeJS.Timer;
  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuth;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/users/signup', authData)
      .subscribe(result => {
        console.log(result);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/users/login',
        authData
      )
      .subscribe(result => {
        const token = result.token;
        this.token = token;
        const expiresTime = result.expiresIn;
        if (token) {
          this.authStatusListener.next(true);
          this.isAuth = true;
          this.setAuthTimer(expiresTime);

          const now = new Date();
          const expired = new Date(now.getTime() + expiresTime * 1000);
          console.log(expired);
          this.saveAuthData(token, expired);
          this.router.navigate(['/']);
        }
      });
  }

  private setAuthTimer(expiresTime: number) {
    console.log('set timer: ' + expiresTime);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresTime * 1000);
  }

  autoAuth() {
    const authInfo = this.getAuthData();
    const now = new Date();
    if (!authInfo) {
      return;
    }
    const expiresTime = authInfo.expirationDate.getTime() - now.getTime();

    if (expiresTime > 0) {
      this.token = authInfo.token;
      this.isAuth = true;

      this.setAuthTimer(expiresTime / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    if (this.token || this.isAuth) {
      this.authStatusListener.next(false);
      this.isAuth = false;
      this.token = null;

      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.router.navigate(['/']);
    }
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token || !expirationDate) {
      return;
    }
    return { token: token, expirationDate: new Date(expirationDate) };
  }
}
