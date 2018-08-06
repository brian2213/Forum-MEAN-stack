import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './models/auth-models';
import { Subject } from '../../../node_modules/rxjs';
import { Router } from '../../../node_modules/@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuth = false;
  private tokenTimer: any;
  private userId: string;

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
  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + '/signup', authData).subscribe(
      result => {
        // console.log(result);
        this.router.navigate(['/']);
      },
      err => {
        // console.log(err);
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(
        result => {
          const token = result.token;
          this.token = token;

          if (token) {
            this.authStatusListener.next(true);
            this.isAuth = true;
            const expiresTime = result.expiresIn;
            this.userId = result.userId;
            this.setAuthTimer(expiresTime);

            const now = new Date();
            const expired = new Date(now.getTime() + expiresTime * 1000);
            // console.log(expired);
            this.saveAuthData(token, expired, this.userId);
            this.router.navigate(['/']);
          }
        },
        err => {
          this.authStatusListener.next(false);
        }
      );
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
      this.userId = authInfo.userId;

      this.setAuthTimer(expiresTime / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    if (this.token || this.isAuth) {
      this.authStatusListener.next(false);
      this.isAuth = false;
      this.token = null;
      this.userId = null;
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.router.navigate(['/']);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
