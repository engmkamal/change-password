import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportdashboardComponent } from './supportdashboard.component';

describe('SupportdashboardComponent', () => {
  let component: SupportdashboardComponent;
  let fixture: ComponentFixture<SupportdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupportdashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
