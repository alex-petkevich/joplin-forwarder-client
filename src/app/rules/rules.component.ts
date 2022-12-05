import {Component, OnInit, ViewChild} from '@angular/core';
import {RulesService} from "../_services/rules.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {IRules} from "../model/rules.model";
import {AuthService} from "../_services/auth.service";
import {SettingsService} from "../_services/settings.service";
import {ISettingsResponse} from "../model/settings_response.model";
import {ISettingsInfo} from "../model/settings.model";
import {DialogComponent} from "../shared-components/dialog/dialog.component";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  rules?: IRules[] | undefined = [];
  userSettings: ISettingsInfo | any = {};
  @ViewChild("dialog") dialogComponent: DialogComponent | undefined;

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
  }

  private loadRules() {
    this.rulesService.getUserRules().subscribe({
      next: data => {
        this.rules = data;
      }
    });
  }

  confirmDelete(id: any) {
    this.translate.get('rules.delete-confirm').subscribe({
      next:data => {
        var modal = this.dialogComponent?.open(data);
        (modal as NgbModalRef).result.then((result) => {
          this.rulesService.deleteRule(id).subscribe({
            next: data => {
              this.loadRules();
            }
          });
        });
      }
    });
  }
}
