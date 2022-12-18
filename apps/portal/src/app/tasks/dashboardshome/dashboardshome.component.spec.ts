import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardshomeComponent } from './dashboardshome.component';

describe('DashboardshomeComponent', () => {
  let component: DashboardshomeComponent;
  let fixture: ComponentFixture<DashboardshomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardshomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardshomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
