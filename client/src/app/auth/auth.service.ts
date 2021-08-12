import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { AuthData } from "./auth-data.model";
import { environment } from '../../environments/environment';
import { trimTrailingNulls } from "@angular/compiler/src/render3/view/util";

const SERVER_URL = environment.apiUrl + 'user/';

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string; // create separate user model if needed
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuthenticated() {
        // NOTE: false
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string) {
        const authData: AuthData = { email, password };
        // NOTE: return back same data as login
        this.http.post<{ token: string, expiresIn: number, userId: string; }>(SERVER_URL + 'signup', authData)
            .subscribe((response) => {
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate, this.userId);
                    this.router.navigate(['/']);
                }
            }, error => {
                this.authStatusListener.next(false);
            });
    }

    loginUser(email: string, password: string) {
        const authData: AuthData = { email, password };
        this.http.post<{ token: string, expiresIn: number, userId: string; }>(SERVER_URL + 'login', authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate, this.userId);
                    this.router.navigate(['/']);
                }
            }, error => {
                this.authStatusListener.next(false);
            });
    }

    // try to auth user if localStorage has data
    autoAuthUser() {
        const authInfo = this.getAuthData();
        if (!authInfo) {
            return;
        }
        const now = new Date();
        // difference between expiration date and current date in milliseconds
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        // expiresIn will be positive if still active, negative means has expired
        if (expiresIn > 0) {
            this.token = authInfo.token;
            this.isAuthenticated = true;
            this.userId = authInfo.userId;
            this.setAuthTimer(expiresIn / 1000); // convert to seconds
            this.authStatusListener.next(true);
        }
    }

    logoutUser() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => { this.logoutUser(); }, duration * 1000);
    }

    // store data in local storage once authed
    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token,
            expirationDate: new Date(expirationDate),
            userId
        };
    }
}