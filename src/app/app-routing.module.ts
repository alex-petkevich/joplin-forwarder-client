import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./account/login/login.component";
import {RegisterComponent} from "./account/register/register.component";
import {ProfileComponent} from "./account/profile/profile.component";
import {BoardUserComponent} from "./board-user/board-user.component";
import {BoardAdminComponent} from "./board-admin/board-admin.component";
import {ForgotPasswordComponent} from "./account/forgot-password/forgot-password.component";
import {PasswordResetComponent} from "./account/password-reset/password-reset.component";
import {SettingsComponent} from "./account/settings/settings.component";
import {RulesComponent} from "./rules/rules.component";
import {RulesEditComponent} from "./rules/edit/rules-edit.component";
import {SyncSettingsComponent} from "./account/sync_settings/sync_settings.component";
import { MailsComponent } from "./mails/mails.component";
import { MailsViewComponent } from "./mails/view/mails-view.component";

const routes: Routes = [
  { path: 'account/activate', component: LoginComponent },
  { path: 'account/forgot-password', component: ForgotPasswordComponent },
  { path: 'account/password-reset', component: PasswordResetComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'rules/new', component: RulesEditComponent },
  { path: 'rules/:id/edit', component: RulesEditComponent },
  { path: 'rules/:id/delete', component: RulesComponent },
  { path: 'mails', component: MailsComponent },
  { path: 'mails/:id/view', component: MailsViewComponent },
  { path: 'mails/:id/download', component: MailsViewComponent },
  { path: 'mails/:id/delete', component: MailsComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'sync', component: SyncSettingsComponent },
  { path: '', redirectTo: 'mails', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
