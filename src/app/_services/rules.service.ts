import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import { IRule, IRuleAction, IRuleCondition } from '../model/rule.model';
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

  getRule(id: Number) : Observable<any> {
    return this.http.get(API_URL + id, { responseType: 'json' });
  }

  deleteRule(id: Number) : Observable<any> {
    return this.http.delete(API_URL + id, { responseType: 'json' });
  }
  
  copyRule(id: Number) : Observable<any> {
    return this.http.post(API_URL + 'copy/' + id, { responseType: 'json' });
  }

  save(rules: IRule): Observable<any> {
    return this.http.post(API_URL, rules, httpOptions);
  }

  addComparisonRule(ruleCondition: IRuleCondition): Observable<any> {
    return this.http.post(API_URL + 'conditions/', ruleCondition, httpOptions);
  }

  addAction(ruleAction: IRuleAction): Observable<any> {
    return this.http.post(API_URL + 'actions/', ruleAction, httpOptions);
  }

  deleteCondition(id: number): Observable<any> {
    return this.http.delete(API_URL + 'conditions/' + id, { responseType: 'json' });
  }

  deleteAction(id: number): Observable<any> {
    return this.http.delete(API_URL + 'actions/' + id, { responseType: 'json' });
  }

}
