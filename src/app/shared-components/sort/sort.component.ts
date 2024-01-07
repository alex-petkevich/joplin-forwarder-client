import {Component, Input} from "@angular/core";
import {IPagination} from "../model/pagination.model";

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent {

  @Input() sort: string = 'received';
  @Input() curentSort: string = '';
  @Input() sortOrder: string = 'desc';
  @Input() callbackFunction: ((args: any) => void) | undefined;

  constructor() {
  }

  reorder(sort: string, sortOrder: string) {
    this.callbackFunction != undefined && this.callbackFunction([sort, sortOrder] );
  }
}
