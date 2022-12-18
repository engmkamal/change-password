import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionButtonsBarComponent } from './action-buttons-bar.component';

describe('ActionButtonsBarComponent', () => {
  let component: ActionButtonsBarComponent;
  let fixture: ComponentFixture<ActionButtonsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionButtonsBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionButtonsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
