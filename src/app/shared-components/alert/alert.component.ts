import {Component, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

/*
Example of use:
<app-alert #alert></app-alert>
@ViewChild("alert") alertComponent: AlertComponent | undefined;
var modal = this.alertComponent?.open("testtesttest");
    (modal as NgbModalRef).result.then((result) => {
      alert('OK PRESSED');
    }, (reason) => {
      alert(`Dismissed`);
    });
 */

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

  textRequest: String = '';
  closeResult: String = '';
  @ViewChild("content", { static: true }) content: TemplateRef<any> | undefined;

  constructor(private modalService: NgbModal) {
  }

  open(text: String, content?: String) {
    this.textRequest = text;
    return this.modalService.open(content ? content : this.content, {ariaLabelledBy: 'modal-basic-title'});
  }
}
