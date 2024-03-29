import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../_services/auth.service";
import {SettingsService} from "../_services/settings.service";
import {DialogComponent} from "../shared-components/dialog/dialog.component";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { MailsService } from "../_services/mails.service";
import { ToastComponent } from "../shared-components/toast/toast.component";
import { PaginationComponent } from "../shared-components/pagination/pagination.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import {FormControl} from "@angular/forms";
import { finalize } from "rxjs";
import { IMail, IPaginatedMails } from "../model/mail.model";
import { ISettingsInfo } from "../model/setting.model";
import { ISettingsResponse } from "../model/setting_response.model";

@Component({
  selector: 'app-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss']
})
export class MailsComponent implements OnInit {
  mails?: IPaginatedMails;
  selMails?: IMail[] | undefined = [];
  userSettings: ISettingsInfo | any = {};
  @ViewChild("dialog") dialogComponent: DialogComponent | undefined;
  @ViewChild("toast") toastComponent: ToastComponent | undefined;
  @ViewChild("pagination") paginationComponent: PaginationComponent | undefined;

  form = {
    exp: []
  };
  resyncProgress: boolean = false;
  loadProgress: boolean = false;
  fexported: FormControl = new FormControl(false);
  fattachments: FormControl = new FormControl(false);
  fsubject: FormControl = new FormControl('');
  ftext: FormControl = new FormControl('');
  sort: string = "received";
  sortOrder: string = "desc";
  isFilterOpen: boolean = false;

  constructor(private mailsService: MailsService,
              private translate: TranslateService,
              private auth: AuthService,
              private settingsService: SettingsService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private location: Location) { }

  async ngOnInit(): Promise<void> {
    await this.auth.isLoggedIn();

    this.loadProgress = true;
    this.activatedRoute.queryParams.subscribe(params => {
      const page = params['page'];
      this.settingsService.getUserSettings().subscribe({
        next: data => {
          (data as Array<ISettingsResponse>).forEach(it => {
            this.userSettings[it.name] = it.value;
          });
          if (this.userSettings.mailserver) {
            this.loadMails(page);
          } else {
            this.loadProgress = false;
          }
        },
        error: err => {
          this.loadProgress = false;
          this.showInternalError(err?.error?.message || err?.message);
        }
      });
    });
  }

  private loadMails(pg : number = 0) {
    this.loadProgress = true;
    this.mailsService.getUserMails(this.fsubject.value,this.ftext.value, this.fattachments.value, this.fexported.value, pg, this.sort, this.sortOrder)
        .pipe(
            finalize(() => {
              this.loadProgress = false;
            })
        )
        .subscribe({
          next: data => {
            this.mails = data;
          },
          error: err => {
            this.showInternalError(err?.error?.message || err?.message);
          }
        });
  }

  private showInternalError(err: any) {
    this.toastComponent?.error( err );
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
        this.showInternalError(err?.error?.message || err?.message)
      }
    })
  }

  isSelected(mail: IMail) {
    return this.selMails != undefined ? this.selMails?.indexOf(mail) >= 0 : false;
  }

  onChange(mail: IMail, checked: boolean) {
    if (checked) {
      this.selMails?.push(mail);
    } else {
      let index = this.selMails?.indexOf(mail) || 0;
      this.selMails?.splice(index, 1);
    }
  }

  displayFilter() {
    return false;
  }

  applyFilters() {
    this.isFilterOpen = true;
    this.loadMails();
    return false;
  }

  resetFilters() {
    this.isFilterOpen = true;
    this.fattachments.setValue(false);
    this.ftext.setValue("");
    this.fsubject.setValue("");
    this.fexported.setValue(false);
    this.loadMails();
    return false;
  }

  reorderCallback = (args: any): void => {
    this.sort = args[0];
    this.sortOrder = args[1];

    this.loadMails();
  }

}
