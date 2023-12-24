import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {IRules} from "../../model/rules.model";
import {COMPARISON_LIST, FINAL_ACTION_LIST, TYPES_LIST} from "../../shared-components/model/enum-mappings";
import {IEnum} from "../../shared-components/model/enum";
import {RulesService} from "../../_services/rules.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-rules-edit',
  templateUrl: './rules-edit.component.html',
  styleUrls: ['./rules-edit.component.scss']
})
export class RulesEditComponent implements OnInit {
  rules: boolean = true;
  currentRule: IRules | undefined = undefined;
  isSuccessful: boolean = false;
  form: IRules = {
    comparison_method: 0,
    comparison_text: "",
    final_action: 0,
    final_action_target: "",
    last_processed_at: undefined,
    processed: 0,
    priority: 0,
    save_in: true,
    save_in_parent_id: "",
    name: "",
    type: 1,
    active: true,
    stop_process_rules: false
  };
  types_list: IEnum[] = TYPES_LIST;
  comparison_list: IEnum[] = COMPARISON_LIST;
  final_action_list: IEnum[] = FINAL_ACTION_LIST;
  errorMessage: String = "";

  constructor(private auth: AuthService, private rulesService: RulesService, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit(): Promise<void> {
   await this.auth.isLoggedIn();

    this.route.params.subscribe(res=>{
      if (res['id']) {
        this.rulesService.getRule(res['id']).subscribe({
          next: data => {
            if (data) {
              this.currentRule = data;
              this.form = this.currentRule as IRules;
            }
          }
        });
      }
    })
  }

  onSubmit(valid: any) {
    this.isSuccessful = false;
    if (!valid) {
      return false;
    }
    this.form.id = this.currentRule?.id;
    this.rulesService.save(this.form).subscribe({
      next: data => {
        console.log(data);
        this.router.navigate(['/rules']).then(() => {
          window.location.reload();
        });
      },
      error: err => {
        this.errorMessage = err?.error?.message || err?.message;
      }
    });
    return true;
  }

  protected readonly undefined = undefined;
}
