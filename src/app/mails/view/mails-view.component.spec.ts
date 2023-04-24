import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailsViewComponent } from './mails-view.component';

describe('MailsViewComponent', () => {
  let component: MailsViewComponent;
  let fixture: ComponentFixture<MailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
