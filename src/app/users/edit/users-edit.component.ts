import { Component, OnInit, ViewChild } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import { UsersService } from "../../_services/users.service";
import { IUser } from "../../model/user.model";
import { IRole } from "../../model/role.model";
import { tap } from "rxjs";
import { DialogComponent } from "../../shared-components/dialog/dialog.component";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastComponent } from "../../shared-components/toast/toast.component";

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit {
  currentUser: IUser | undefined = undefined;
  isSuccessful: boolean = false;
  form: IUser = {
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    lang: "",
    last_modified_at: undefined,
    created_at: undefined,
    roles: [],
    active: true
  };
  errorMessage: String = "";
  roles: IRole[] = [];
  @ViewChild("finalDialog") toastComponent: ToastComponent | undefined;

  constructor(private auth: AuthService, private usersService: UsersService, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit(): Promise<void> {
   await this.auth.isLoggedIn();

    this.route.params.subscribe(res=>{
      if (res['id']) {
        this.usersService.get(res['id'])
            .pipe(
                tap(() => this.getRoles())
            )
            .subscribe({
              next: data => {
                if (data) {
                  this.currentUser = data;
                  this.form = this.currentUser as IUser;
                }
              }
        });
      }
    })
  }

  onSubmit(valid: any) {
    this.isSuccessful = false;
    if (!valid) {
      return false;
    }
    const savedUser = this.form;

    this.usersService.save(this.form).subscribe({
      next: data => {
        this.router.navigate(['/admin/users']).then(() => {
          window.location.reload();
        });
      },
      error: err => {
        this.errorMessage = err?.error?.message || err?.message;
      }
    });
    return true;
  }

  initiateResetPassword() {
    this.toastComponent?.success("Password reset link was sent user successfully");
    return false;
  }

  hasRole(role: IRole) {
      return this.form.roles?.find(rl => rl.id === role.id);
  }

  private getRoles() {
    this.usersService.getRoles().subscribe({
      next: data => {
        this.roles = data;
      }
    });
  }

  changeRole(role: IRole) {
    const arrRole = this.hasRole(role);
    if (arrRole) {
      const idxRole = this.form.roles?.indexOf(arrRole);
      if (idxRole !== undefined && idxRole > -1) {
        this.form.roles?.splice(idxRole, 1);
      }
    } else {
      this.form.roles?.push(role);
    }
  }
}
