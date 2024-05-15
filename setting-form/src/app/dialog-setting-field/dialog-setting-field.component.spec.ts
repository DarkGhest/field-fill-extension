import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSettingFieldComponent } from './dialog-setting-field.component';

describe('DialogSettingFieldComponent', () => {
  let component: DialogSettingFieldComponent;
  let fixture: ComponentFixture<DialogSettingFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSettingFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSettingFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
