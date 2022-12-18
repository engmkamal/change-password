import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupcontrolComponent } from './groupcontrol.component';

describe('GroupcontrolComponent', () => {
  let component: GroupcontrolComponent;
  let fixture: ComponentFixture<GroupcontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupcontrolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
