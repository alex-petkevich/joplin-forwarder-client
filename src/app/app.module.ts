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
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import {ForgotPasswordComponent} from "./account/forgot-password/forgot-password.component";
import {PasswordResetComponent} from "./account/password-reset/password-reset.component";
import {ImageUploadComponent} from "./shared-components/image-upload/image-upload.component";
import {NgxTranslateModule} from "./translate/translate.module";
import {SettingsComponent} from "./account/settings/settings.component";

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
    BoardAdminComponent,
    BoardUserComponent,
    ImageUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxTranslateModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

