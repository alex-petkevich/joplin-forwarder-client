import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

const AUTH_API = 'http://localhost:8080/api/account/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string, lastname: string, firstname: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password,
      firstname,
      lastname
    }, httpOptions);
  }

  activate(key: string): Observable<any> {
    return this.http.post(AUTH_API + 'activate', {
      key
    }, httpOptions);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.get(AUTH_API + 'forgot-password/' + email, { responseType: 'json' });
  }

  passwordReset(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'password-reset/', {
      username,
      password
    }, httpOptions);
  }

  checkKey(key: string): Observable<any> {
    return this.http.post(AUTH_API + 'check-key', {
      key
    }, httpOptions);
  }

}
