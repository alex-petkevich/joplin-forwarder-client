import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {IRules} from "../model/rules.model";
const API_URL = environment.backendUrl + 'api/rules/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  constructor(private http: HttpClient) { }

  getUserRules() : Observable<any> {
    return this.http.get(API_URL, { responseType: 'json' });
  }

  save(rules: IRules): Observable<any> {
    return this.http.post(API_URL, rules, httpOptions);
  }

}
