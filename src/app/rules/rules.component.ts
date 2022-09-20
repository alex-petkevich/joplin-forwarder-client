import { Component, OnInit } from '@angular/core';
import {RulesService} from "../_services/rules.service";
import {TranslateService} from "@ngx-translate/core";
import {TokenStorageService} from "../_services/token-storage.service";
import {Router} from "@angular/router";
import {IRules} from "../model/rules.model";

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  rules?: IRules[] | undefined = [];
  private currentUser: any;

  constructor(private rulesService: RulesService, private translate: TranslateService, private token: TokenStorageService, private route: Router) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if (!this.token.getToken()) {
      this.route.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }
    this.rulesService.getUserRules().subscribe({
      next: data => {
        this.rules = data;
      }
    });
  }

}
