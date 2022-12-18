import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatedtasksComponent } from './delegatedtasks.component';

describe('DelegatedtasksComponent', () => {
  let component: DelegatedtasksComponent;
  let fixture: ComponentFixture<DelegatedtasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelegatedtasksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DelegatedtasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
