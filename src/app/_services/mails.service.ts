import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {IRules} from "../model/rules.model";
const API_URL = environment.backendUrl + 'api/mails/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MailsService {

  constructor(private http: HttpClient) { }

  getUserMails() : Observable<any> {
    return this.http.get(API_URL, { responseType: 'json' });
  }

  getMail(id: Number) : Observable<any> {
    return this.http.get(API_URL + id, { responseType: 'json' });
  }

  deleteMail(id: Number) : Observable<any> {
    return this.http.delete(API_URL + id, { responseType: 'json' });
  }
}
