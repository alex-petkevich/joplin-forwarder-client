import { Component, OnInit } from '@angular/core';
import {RulesService} from "../_services/rules.service";
import {TranslateService} from "@ngx-translate/core";
import {TokenStorageService} from "../_services/token-storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IRules} from "../model/rules.model";
import {AuthService} from "../_services/auth.service";
import {SettingsService} from "../_services/settings.service";
import {ISettingsResponse} from "../model/settings_response.model";
import {ISettingsInfo} from "../model/settings.model";

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  rules?: IRules[] | undefined = [];
  userSettings: ISettingsInfo | any = {};


  constructor(private rulesService: RulesService,
              private translate: TranslateService,
              private auth: AuthService,
              private settingsService: SettingsService,
              private router: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    await this.auth.isLoggedIn();

    this.settingsService.getUserSettings().subscribe({
      next: data => {
        (data as Array<ISettingsResponse>).forEach(it => {
          this.userSettings[it.name] = it.value;
        });
        if (this.userSettings.mailserver) {
          this.loadRules();
        }
      }
    });

    this.router.params.subscribe(res=>{
      if (res['id']) {
        this.rulesService.deleteRule(res['id']).subscribe({
          next: data => {
            this.loadRules();
          }
        });
      }
    })
  }

  private loadRules() {
    this.rulesService.getUserRules().subscribe({
      next: data => {
        this.rules = data;
      }
    });
  }
}
