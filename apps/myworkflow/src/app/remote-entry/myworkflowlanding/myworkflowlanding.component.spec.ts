import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyworkflowlandingComponent } from './myworkflowlanding.component';

describe('MyworkflowlandingComponent', () => {
  let component: MyworkflowlandingComponent;
  let fixture: ComponentFixture<MyworkflowlandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyworkflowlandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyworkflowlandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
