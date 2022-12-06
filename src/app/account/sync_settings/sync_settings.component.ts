import { Component, OnInit } from '@angular/core';
import {ISettingsInfo} from "../../model/settings.model";
import {SettingsService} from "../../_services/settings.service";
import {ISettingsResponse} from "../../model/settings_response.model";
import {AuthService} from "../../_services/auth.service";
import {IEnum} from "../../shared-components/model/enum";
import {JOPLIN_SERVER_TYPES_LIST} from "../../shared-components/model/enum-mappings";

@Component({
  selector: 'app-sync_settings',
  templateUrl: './sync_settings.component.html',
  styleUrls: ['./sync_settings.component.scss']
})
export class SyncSettingsComponent implements OnInit {

  joplin_server_types_list: IEnum[] = JOPLIN_SERVER_TYPES_LIST;
  form: any = {
    joplinserver: null,
    joplinserverdavurl: null,
    joplinserverdavusername: null,
    joplinserverdavpassword: null,
    joplinserverserverurl: null,
    joplinserverserverusername: null,
    joplinserverserverpassword: null,
    id: null,
    user_id: null
  };
  isSuccessful = false;
  isUpdatingFailed = false;
  errorMessage = '';

  constructor(private settingsService: SettingsService, private auth: AuthService) { }

  async ngOnInit(): Promise<void> {
    await this.auth.isLoggedIn();

    this.settingsService.getUserSettings().subscribe({
      next: data => {
        (data as Array<ISettingsResponse>).forEach(it => {
          this.form[it.name] = it.value;
        });
      }
    });
  }

  onSubmit(valid: any): void {
    let { joplinserver, joplinserverdavurl, joplinserverdavusername, joplinserverdavpassword, joplinserverserverurl, joplinserverserverusername, joplinserverserverpassword } = this.form;
    const settings: ISettingsInfo = {
      'joplinserver': joplinserver,
      'joplinserverdavurl': joplinserverdavurl,
      'joplinserverdavusername': joplinserverdavusername,
      'joplinserverdavpassword': joplinserverdavpassword,
      'joplinserverserverurl': joplinserverserverurl,
      'joplinserverserverusername': joplinserverserverusername,
      'joplinserverserverpassword': joplinserverserverpassword
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
