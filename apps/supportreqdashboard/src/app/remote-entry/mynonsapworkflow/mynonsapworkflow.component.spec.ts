import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MynonsapworkflowComponent } from './mynonsapworkflow.component';

describe('MynonsapworkflowComponent', () => {
  let component: MynonsapworkflowComponent;
  let fixture: ComponentFixture<MynonsapworkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MynonsapworkflowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MynonsapworkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
