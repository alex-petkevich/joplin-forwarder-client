import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {TokenStorageService} from "../../_services/token-storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: any = {
    username: null,
    password: null
  };
  isSentSucessfully = false;
  isSentFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {
  }

  onSubmit() : void {
    const {email} = this.form;
    this.authService.forgotPassword(email).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isSentSucessfully = true;
        this.isSentFailed = false;
      } ,
      error: err => {
        this.errorMessage = err.error.message;
        this.isSentFailed = true;
      }
    });
  }

}
