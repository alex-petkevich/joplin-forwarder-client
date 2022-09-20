import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesEditComponent } from './rules.component';

describe('RulesComponent', () => {
  let component: RulesEditComponent;
  let fixture: ComponentFixture<RulesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RulesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
