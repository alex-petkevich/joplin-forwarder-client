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
        this.userService.getAvatarImage(data.username)
            .subscribe({
              next: image =>  this.createImage(image) ,
              error: err => this.handleImageRetrievalError(err)
            });
      }
    })
  }

  private handleImageRetrievalError(err: Error) {
    console.error(err);
    // https://careydevelopment.us/blog/angular-how-to-fetch-and-display-images-with-a-spring-boot-rest-service
//    this.showSpinner = false;
//    this.alertService.error("Problem retrieving profile photo.");
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

  private createImage(image: Blob) {
    if (image && image.size > 0) {
      let reader = new FileReader();

      reader.addEventListener("load", () => {
//        this.imageToShow = reader.result;
//        this.showSpinner = false;
      }, false);

      reader.readAsDataURL(image);
    } else {
//      this.showSpinner = false;
    }
  }
}
