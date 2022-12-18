import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskassigneeselectComponent } from './taskassigneeselect.component';

describe('TaskassigneeselectComponent', () => {
  let component: TaskassigneeselectComponent;
  let fixture: ComponentFixture<TaskassigneeselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskassigneeselectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskassigneeselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
