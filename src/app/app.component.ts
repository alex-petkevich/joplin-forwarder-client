import { Component } from '@angular/core';
import {TokenStorageService} from "./_services/token-storage.service";
import {FileService} from "./_services/file.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  username?: string;
  avatar?:any;

  constructor(private tokenStorageService: TokenStorageService, private fileService: FileService, translate: TranslateService) {
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.username = user.username;
      this.fileService.getUserImage(this.username as string).subscribe({
        next: data => {
          this.loadImage(data);
        }
      })
    }
  }
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  private loadImage(image: Blob) {
    if (image && image.size > 0) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.avatar = reader.result;
      }, false);
      reader.readAsDataURL(image);
    }
  }
}
