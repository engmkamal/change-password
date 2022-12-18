import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingtasksComponent } from './pendingtasks.component';

describe('PendingtasksComponent', () => {
  let component: PendingtasksComponent;
  let fixture: ComponentFixture<PendingtasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingtasksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingtasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
