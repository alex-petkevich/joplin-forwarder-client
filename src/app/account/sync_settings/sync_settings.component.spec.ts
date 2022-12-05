import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sync_settingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: Sync_settingsComponent;
  let fixture: ComponentFixture<Sync_settingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sync_settingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Sync_settingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
