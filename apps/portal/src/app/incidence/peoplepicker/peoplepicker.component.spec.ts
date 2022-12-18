import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplepickerComponent } from './peoplepicker.component';

describe('PeoplepickerComponent', () => {
  let component: PeoplepickerComponent;
  let fixture: ComponentFixture<PeoplepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeoplepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeoplepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
