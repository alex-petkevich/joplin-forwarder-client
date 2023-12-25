import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './account/profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardUserComponent } from './board-user/board-user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import {ForgotPasswordComponent} from "./account/forgot-password/forgot-password.component";
import {PasswordResetComponent} from "./account/password-reset/password-reset.component";
import {ImageUploadComponent} from "./shared-components/image-upload/image-upload.component";
import {DialogComponent} from "./shared-components/dialog/dialog.component";
import {NgxTranslateModule} from "./translate/translate.module";
import {SettingsComponent} from "./account/settings/settings.component";
import {SyncSettingsComponent} from "./account/sync_settings/sync_settings.component";
import {RulesComponent} from "./rules/rules.component";
import {RulesEditComponent} from "./rules/edit/rules-edit.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MailsComponent } from "./mails/mails.component";
import { MailsViewComponent } from "./mails/view/mails-view.component";
import { ToastComponent } from "./shared-components/toast/toast.component";
import { PaginationComponent } from "./shared-components/pagination/pagination.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    PasswordResetComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    SettingsComponent,
    SyncSettingsComponent,
    BoardAdminComponent,
    BoardUserComponent,
    ImageUploadComponent,
    DialogComponent,
    RulesComponent,
    RulesEditComponent,
    MailsComponent,
    MailsViewComponent,
    ToastComponent,
    PaginationComponent
  ],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		NgxTranslateModule,
		NgbModule,
		ReactiveFormsModule
	],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

