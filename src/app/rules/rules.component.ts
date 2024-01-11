import { Component, OnInit, ViewChild } from '@angular/core';
import { RulesService } from "../_services/rules.service";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";
import { IRules } from "../model/rules.model";
import { AuthService } from "../_services/auth.service";
import { SettingsService } from "../_services/settings.service";
import { ISettingsResponse } from "../model/settings_response.model";
import { ISettingsInfo } from "../model/settings.model";
import { DialogComponent } from "../shared-components/dialog/dialog.component";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { finalize } from "rxjs";

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
    rules?: IRules[] | undefined = [];
    userSettings: ISettingsInfo | any = {};
    loadProgress: boolean = false;

    @ViewChild("dialog") dialogComponent: DialogComponent | undefined;

    constructor(private rulesService: RulesService,
                private translate: TranslateService,
                private auth: AuthService,
                private settingsService: SettingsService,
                private router: ActivatedRoute) {
    }

    async ngOnInit(): Promise<void> {
        await this.auth.isLoggedIn();

        this.loadProgress = true;
        this.settingsService.getUserSettings()
            .subscribe({
                next: data => {
                    (data as Array<ISettingsResponse>).forEach(it => {
                        this.userSettings[it.name] = it.value;
                    });
                    if (this.userSettings.mailserver) {
                        this.loadRules();
                    } else {
                        this.loadProgress = false;
                    }
                }
            });
    }

    private loadRules() {
        this.loadProgress = true;
        this.rulesService.getUserRules()
            .pipe(
                finalize(() => {
                    this.loadProgress = false;
                })
            )
            .subscribe({
                next: data => {
                    this.rules = data;
                }
            });
    }

    confirmDelete(id: any) {
        this.translate.get('rules.delete-confirm').subscribe({
            next: data => {
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

    moveUp(rule: IRules) {
        const index = this.rules?.indexOf(rule) as number;
        const rlprev = index > 0 ? index - 1 : 0;
        const prevRule = this.rules![rlprev];
        if (!prevRule) {
            return;
        }
        const prevPriority = prevRule.priority;
        prevRule.priority = rule.priority;
        rule.priority = prevPriority;
        if (rule.priority == prevRule.priority) {
            prevRule!.priority!++;
        }


        this.rulesService.save(rule).subscribe({
            next: data => {
                (prevRule.priority as number)++;
                this.rulesService.save(prevRule).subscribe({
                    next: data => {
                        this.loadRules();
                    }
                });
            }
        });
    }

    moveDown(rule: IRules) {
        const index = this.rules?.indexOf(rule) as number;
        const rlnext = (index + 1) % this.rules!.length;
        const nxtRule = this.rules![rlnext];
        if (!nxtRule) {
            return;
        }
        const currPriority = rule.priority;
        rule.priority = nxtRule.priority;
        nxtRule.priority = currPriority;
        if (rule.priority == nxtRule.priority) {
            rule!.priority!++;
        }

        this.rulesService.save(rule).subscribe({
            next: data => {
                this.rulesService.save(nxtRule).subscribe({
                    next: data => {
                        this.loadRules();
                    }
                });
            }
        });
    }
}
