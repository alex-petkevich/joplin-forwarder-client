import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../_services/auth.service";
import {SettingsService} from "../_services/settings.service";
import {ISettingsResponse} from "../model/settings_response.model";
import {ISettingsInfo} from "../model/settings.model";
import {DialogComponent} from "../shared-components/dialog/dialog.component";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { IMails, IPaginatedMails } from "../model/mails.model";
import { MailsService } from "../_services/mails.service";
import { ToastComponent } from "../shared-components/toast/toast.component";
import { PaginationComponent } from "../shared-components/pagination/pagination.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss']
})
export class MailsComponent implements OnInit {
  mails?: IPaginatedMails;
  selMails?: IMails[] | undefined = [];
  userSettings: ISettingsInfo | any = {};
  @ViewChild("dialog") dialogComponent: DialogComponent | undefined;
  @ViewChild("toast") toastComponent: ToastComponent | undefined;
  @ViewChild("pagination") paginationComponent: PaginationComponent | undefined;

  form = {
    exp: []
  };
  resyncProgress: boolean = false;

  constructor(private mailsService: MailsService,
              private translate: TranslateService,
              private auth: AuthService,
              private settingsService: SettingsService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private location: Location) { }

  async ngOnInit(): Promise<void> {
    await this.auth.isLoggedIn();

    this.activatedRoute.queryParams.subscribe(params => {
      const page = params['page'];
      this.settingsService.getUserSettings().subscribe({
        next: data => {
          (data as Array<ISettingsResponse>).forEach(it => {
            this.userSettings[it.name] = it.value;
          });
          if (this.userSettings.mailserver) {
            this.loadMails(page);
          }
        }
      });
    });


  }

  private loadMails(pg : number = 0) {
    this.mailsService.getUserMails(pg).subscribe({
      next: data => {
        this.mails = data;
      }
    });
  }

  pageCallback = (args: any): void => {
    const url = this.router.createUrlTree([], {relativeTo: this.activatedRoute, queryParams: {page: args}}).toString()
    this.location.go(url);
    this.loadMails(args);
  }

  confirmDelete(id: any) {
    this.translate.get('mails.delete-confirm').subscribe({
      next:data => {
        var modal = this.dialogComponent?.open(data);
        (modal as NgbModalRef).result.then((result) => {
          this.mailsService.deleteMail(id).subscribe({
            next: data => {
              this.loadMails();
            }
          });
        });
      }
    });
  }

  onSubmit(valid: boolean) {
    this.resyncProgress = true;



    this.mailsService.resyncMails(this.selMails).subscribe({
      next: data => {
        this.translate.get('mails.resync-success').subscribe({
          next:data => {
            this.resyncProgress = false;
            this.toastComponent?.success(data);
          }
        });
      },
      error: err => {
        this.resyncProgress = false;
        this.toastComponent?.error( err?.error?.message || err?.message);
      }
    })
  }

  isSelected(mail: IMails) {
    return this.selMails != undefined ? this.selMails?.indexOf(mail) >= 0 : false;
  }

  onChange(mail: IMails, checked: boolean) {
    if (checked) {
      this.selMails?.push(mail);
    } else {
      let index = this.selMails?.indexOf(mail) || 0;
      this.selMails?.splice(index, 1);
    }
  }
}
