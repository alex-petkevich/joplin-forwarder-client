import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../_services/auth.service";
import {ActivatedRoute} from "@angular/router";
import { MailsService } from "../../_services/mails.service";
import {saveAs} from "file-saver";
import { IMail } from "../../model/mail.model";

@Component({
  selector: 'app-rules-edit',
  templateUrl: './mails-view.component.html',
  styleUrls: ['./mails-view.component.scss']
})
export class MailsViewComponent implements OnInit {
  rules: boolean = true;
  currentMail: IMail | undefined = undefined;

  constructor(private auth: AuthService, private mailsService: MailsService, private router: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
   await this.auth.isLoggedIn();

    this.router.params.subscribe(res=>{
      if (res['id']) {
        this.mailsService.getMail(res['id']).subscribe({
          next: data => {
            if (data) {
              this.currentMail = data as IMail;
            }
          }
        });
      }
    })
  }

  download(id: number | undefined, f: string) {
    this.mailsService.downloadAttach(id as number, f).subscribe(data => saveAs(data, f));
  }

}
