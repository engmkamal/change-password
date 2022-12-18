import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentdashboardlandingComponent } from './parentdashboardlanding.component';

describe('ParentdashboardlandingComponent', () => {
  let component: ParentdashboardlandingComponent;
  let fixture: ComponentFixture<ParentdashboardlandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentdashboardlandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentdashboardlandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
