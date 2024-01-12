import { Component, OnInit } from '@angular/core';
import {ISettingsInfo} from "../../model/settings.model";
import {SettingsService} from "../../_services/settings.service";
import {ISettingsResponse} from "../../model/settings_response.model";
import {AuthService} from "../../_services/auth.service";
import {IEnum} from "../../shared-components/model/enum";
import {JOPLIN_SERVER_TYPES_LIST} from "../../shared-components/model/enum-mappings";

export interface ICachedNode {
  id: string;
  parentId: string;
  name: string;
}

@Component({
  selector: 'app-sync_settings',
  templateUrl: './sync_settings.component.html',
  styleUrls: ['./sync_settings.component.scss']
})
export class SyncSettingsComponent implements OnInit {

  joplinServerTypesList: IEnum[] = JOPLIN_SERVER_TYPES_LIST;
  form: any = {
    joplinserver: null,
    joplinserverdavurl: null,
    joplinserverdavusername: null,
    joplinserverdavpassword: null,
    joplinserverserverurl: null,
    joplinserverserverusername: null,
    joplinserverserverpassword: null,
    joplinserverparentnode: null,
    joplinnodescachedlist: null,
    id: null,
    user_id: null
  };
  joplinCachedNodesList:  ICachedNode[] = [];
  isSuccessful = false;
  isUpdatingFailed = false;
  errorMessage = '';
  parentnode: string = '';

  constructor(private settingsService: SettingsService, private auth: AuthService) { }

  async ngOnInit(): Promise<void> {
    await this.auth.isLoggedIn();

    this.settingsService.getUserSettings().subscribe({
      next: data => {
        (data as Array<ISettingsResponse>).forEach(it => {
          this.form[it.name] = it.value;
        });
        if (this.form["joplinnodescachedlist"]) {
          this.joplinCachedNodesList = this.buildTree(JSON.parse(this.form["joplinnodescachedlist"]));
        }
      }
    });
  }

  private buildTree(parse: ICachedNode[]) {
    let res :ICachedNode[] = [];
    parse.forEach(it => {
      if (!it.parentId) {
        res.push(it);
        res.push(...this.populateNode(it, parse, 1));
      }
    });
    return res;
  }

  private populateNode(node: ICachedNode, parsedTree: ICachedNode[], deep: number) {
    let res :ICachedNode[] = [];
    parsedTree.forEach(it => {
      if (node.id == it.parentId) {
        it.name = "&nbsp;".repeat(3 * deep) + it.name;
        res.push(it);
        res.push(...this.populateNode(it, parsedTree, deep + 1));
      }
    });
    return res;
  }

  onSubmit(valid: any): void {
    let { joplinserver, joplinserverdavurl, joplinserverdavusername, joplinserverdavpassword, joplinserverserverurl, joplinserverserverusername, joplinserverserverpassword, joplinserverparentnode } = this.form;
    const settings: ISettingsInfo = {
      'joplinserver': joplinserver,
      'joplinserverdavurl': joplinserverdavurl,
      'joplinserverdavusername': joplinserverdavusername,
      'joplinserverdavpassword': joplinserverdavpassword,
      'joplinserverserverurl': joplinserverserverurl,
      'joplinserverserverusername': joplinserverserverusername,
      'joplinserverserverpassword': joplinserverserverpassword,
      'joplinserverparentnode': joplinserverparentnode!.$ngOptionLabel!.replace('&nbsp;', '')
    }
    this.settingsService.save(settings).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isUpdatingFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isUpdatingFailed = true;
      }
    });
  }
}
