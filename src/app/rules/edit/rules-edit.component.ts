import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {
  COMPARISON_CONDITION,
  COMPARISON_LIST,
  FINAL_ACTION_LIST,
  getEnumDisplayByName,
  TYPES_LIST
} from '../../shared-components/model/enum-mappings';
import {IEnum} from "../../shared-components/model/enum";
import {RulesService} from "../../_services/rules.service";
import {ActivatedRoute, Router} from "@angular/router";
import { IRule, IRuleAction, IRuleCondition } from '../../model/rule.model';
import { ICachedNode } from "../../account/sync_settings/sync_settings.component";
import { ISettingsResponse } from "../../model/setting_response.model";
import { SettingsService } from "../../_services/settings.service";
import { buildTree } from "../../shared-components/utils";
import { DialogComponent } from '../../shared-components/dialog/dialog.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastComponent } from '../../shared-components/toast/toast.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-rules-edit',
  templateUrl: './rules-edit.component.html',
  styleUrls: ['./rules-edit.component.scss']
})
export class RulesEditComponent implements OnInit {
  rules: boolean = true;
  currentRule: IRule | undefined = undefined;
  isSuccessful: boolean = false;
  isSuccessfulNew: boolean = false;
  save_in_parent_id: any | undefined;
  @ViewChild("f") mainForm: NgForm | undefined;
  @ViewChild("dialog") dialogComponent: DialogComponent | undefined;
  @ViewChild('type') form_type: ElementRef | undefined;
  @ViewChild('condition') form_condition: ElementRef | undefined;
  @ViewChild('comparison_method') form_comparison_method: ElementRef | undefined;
  @ViewChild('comparison_text') form_comparison_text: ElementRef | undefined;
  @ViewChild('action') form_action: ElementRef | undefined;
  @ViewChild('action_target') form_action_target: ElementRef | undefined;

  @ViewChild("toast") toastComponent: ToastComponent | undefined;

  form: IRule = {
    last_processed_at: undefined,
    processed: 0,
    priority: 0,
    save_in: true,
    save_in_parent_id: "",
    name: "",
    active: true,
    stop_process_rules: false,
    rule_conditions: [],
    rule_actions: []
  };
  ruleAction: IRuleAction = {
    action: 0
  };
  types_list: IEnum[] = TYPES_LIST;
  comparison_list: IEnum[] = COMPARISON_LIST;
  final_action_list: IEnum[] = FINAL_ACTION_LIST;
  comparison_condition: IEnum[] = COMPARISON_CONDITION;
  errorMessage: String = "";
  joplinCachedNodesList:  ICachedNode[] = [];
  
  constructor(private auth: AuthService,
              private rulesService: RulesService,
              private route: ActivatedRoute,
              private router: Router,
              private settingsService: SettingsService,
              private translate: TranslateService) { }

  async ngOnInit(): Promise<void> {
    this.auth.isLoggedIn();

    this.settingsService.getUserSettings().subscribe({
      next: data => {
          (data as Array<ISettingsResponse>).forEach(it => {
            if (it.name == "joplinnodescachedlist" && it.value) {
              this.joplinCachedNodesList = buildTree(JSON.parse(it.value));
            }
        })
      }
    });

    this.route.params.subscribe(res=>{
      if (res['id']) {
        this.rulesService.getRule(res['id']).subscribe({
          next: data => {
            if (data) {
              this.currentRule = data;
              this.form = this.currentRule as IRule;
            }
          }
        });
      }
    })
  }

  onSubmit(valid: any) {
    this.isSuccessful = false;
    this.isSuccessfulNew = false;
    if (!valid) {
      return false;
    }
    const letForm = this.form;
    letForm.id = this.currentRule?.id;
    letForm.rule_actions = undefined;
    letForm.rule_conditions = undefined;
    letForm.save_in_parent_id = letForm.save_in_parent_id != null && letForm.save_in_parent_id.label != null ? letForm.save_in_parent_id.label : letForm.save_in_parent_id;
    this.rulesService.save(letForm).subscribe({
      next: data => {
        console.log(data);
        this.currentRule?.id ? this.isSuccessful = true : this.isSuccessfulNew = true;
        this.currentRule = data;
      },
      error: err => {
        this.errorMessage = err?.error?.message || err?.message;
      }
    });
    return true;
  }

  addComparisonRule() {
    if (this.form_condition?.nativeElement?.value) {
      let ruleCondition: IRuleCondition = {
        type: this.form_type?.nativeElement?.value,
        comparison_text: this.form_comparison_text?.nativeElement?.value,
        comparison_method: this.form_comparison_method?.nativeElement?.value,
        rule_id: this.currentRule?.id,
        cond: this.form_condition?.nativeElement?.value == 'AND' ? 1 : 0
      };
      this.rulesService.addComparisonRule(ruleCondition).subscribe({
        next: data => {
          this.currentRule!.rule_conditions = data;
          this.form_type!.nativeElement.value = "";
          this.form_comparison_text!.nativeElement.value = "";
          this.form_comparison_method!.nativeElement.value = "";
          this.form_condition!.nativeElement.value = "";
          this.isSuccessful = false;
          this.isSuccessfulNew = false;
        },
        error: err => {
          console.log(err?.error?.message || err?.message);
          this.showInternalError();
        }
      });
    }
    return false;
  }

  addActionRule() {
    if (this.form_action?.nativeElement?.value) {
      let ruleAction: IRuleAction = {
        rule_id: this.currentRule?.id,
        action: this.form_action?.nativeElement?.value,
        action_target: this.form_action_target?.nativeElement?.value
      };
      this.rulesService.addAction(ruleAction).subscribe({
        next: data => {
          this.currentRule!.rule_actions = data;
          console.log(data);
          this.form_action!.nativeElement.value = '';
          this.form_action_target!.nativeElement.value = '';
          this.isSuccessful = false;
          this.isSuccessfulNew = false;
        },
        error: err => {
          console.log(err?.error?.message || err?.message);
          this.showInternalError();
        }
      });
    }
    return false;
  }

  geDisplayByName(arr: IEnum[], name: string) {
    return getEnumDisplayByName(arr, name);
  }

  delRuleAction(id: number | undefined) {
    if (!id) {
      return;
    }
    this.translate.get('rules.edit.confirm-delete-rule').subscribe({
      next: data => {
        let modal = this.dialogComponent?.open(data);
        (modal as NgbModalRef).result.then(() => {
          this.rulesService.deleteAction(id).subscribe({
            next: data => {
              this.currentRule!.rule_actions = data;
              console.log(data);
            },
            error: err => {
              console.log(err?.error?.message || err?.message);
              this.showInternalError();
            }
          });
        });
      }
    });
    return false;
  }

  delRuleCondition(id: number | undefined) {
    if (!id) {
      return;
    }
    this.translate.get('rules.edit.confirm-delete-rule').subscribe({
      next: data => {
        let modal = this.dialogComponent?.open(data);
        (modal as NgbModalRef).result.then(() => {
          this.rulesService.deleteCondition(id).subscribe({
            next: data => {
              this.currentRule!.rule_conditions = data;
              console.log(data);
            },
            error: err => {
              console.log(err?.error?.message || err?.message);
              this.showInternalError();
            }
          });
        });
      }
    });
    return false;
  }

  private showInternalError() {
    this.translate.get('rules.edit.server-error').subscribe({
      next: data => {
        this.toastComponent?.error(data);
      }
    });
  }
}
