import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesEditComponent implements OnInit {
  rules: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
