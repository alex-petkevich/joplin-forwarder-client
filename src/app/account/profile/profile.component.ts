import { Component, OnInit } from '@angular/core';
import {UserService} from "../../_services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUser: any;

  form: any = {
    email: null,
    password: null,
    firstname: null,
    lastname: null
  };
  isSuccessful = false;
  isUpdatingFailed = false;
  errorMessage = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: data => {
        this.currentUser = data;
        this.form.email = data.email;
        this.form.firstname = data.firstname;
        this.form.lastname = data.lastname;
      }
    })
  }

  onSubmit(): void {
    let { email, lastname, firstname } = this.form;
    this.userService.saveUser(this.currentUser.username, email, lastname, firstname).subscribe({
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
