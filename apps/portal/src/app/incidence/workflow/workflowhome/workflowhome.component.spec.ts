import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowhomeComponent } from './workflowhome.component';

describe('WorkflowhomeComponent', () => {
  let component: WorkflowhomeComponent;
  let fixture: ComponentFixture<WorkflowhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowhomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
