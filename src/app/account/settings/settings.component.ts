import { Component, OnInit } from '@angular/core';
import {UserService} from "../../_services/user.service";
import {TranslateService} from "@ngx-translate/core";
import {ISettingsInfo} from "../../model/settings.model";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  currentUser: any;

  form: any = {
    mailserver: null,
    mailport: null,
    username: null,
    password: null
  };
  isSuccessful = false;
  isUpdatingFailed = false;
  errorMessage = '';

  constructor(private userService: UserService, translate: TranslateService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: data => {
        this.currentUser = data;
        this.form.mailserver = data.mailserver;
        this.form.mailport = data.mailport;
        this.form.username = data.username;
        this.form.password = data.password;
      }
    })
  }

  onSubmit(): void {
    let { mailserver, mailport, username, password } = this.form;
    const settings: ISettingsInfo = {
      
    }
    this.userService.saveUser(mailserver, mailport, username, password).subscribe({
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
