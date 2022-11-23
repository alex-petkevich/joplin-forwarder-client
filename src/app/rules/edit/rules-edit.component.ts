import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {IRules} from "../../model/rules.model";
import {COMPARISON_LIST, FINAL_ACTION_LIST, TYPES_LIST} from "../../shared-components/model/enum-mappings";
import {IEnum} from "../../shared-components/model/enum";
import {RulesService} from "../../_services/rules.service";
import {ActivatedRoute} from "@angular/router";

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
    save_in: 0,
    name: "",
    type: 1
  };
  types_list: IEnum[] = TYPES_LIST;
  comparison_list: IEnum[] = COMPARISON_LIST;
  final_action_list: IEnum[] = FINAL_ACTION_LIST;
  errorMessage: String = "";

  constructor(private auth: AuthService, private rulesService: RulesService, private router: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
   await this.auth.isLoggedIn();

    this.router.params.subscribe(res=>{
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
    this.form.save_in = this.form.save_in ? 1 : 0;
    this.form.id = this.currentRule?.id;
    this.rulesService.save(this.form).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.currentRule = data;
      },
      error: err => {
        this.errorMessage = err.error.message;
      }
    });
    return true;
  }
}
