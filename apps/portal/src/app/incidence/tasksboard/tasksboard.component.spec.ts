import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksboardComponent } from './tasksboard.component';

describe('TasksboardComponent', () => {
  let component: TasksboardComponent;
  let fixture: ComponentFixture<TasksboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
