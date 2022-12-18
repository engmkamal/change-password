import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysapworkflowComponent } from './mysapworkflow.component';

describe('MysapworkflowComponent', () => {
  let component: MysapworkflowComponent;
  let fixture: ComponentFixture<MysapworkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MysapworkflowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MysapworkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
