import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportformComponent } from './supportform.component';

describe('SupportformComponent', () => {
  let component: SupportformComponent;
  let fixture: ComponentFixture<SupportformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
