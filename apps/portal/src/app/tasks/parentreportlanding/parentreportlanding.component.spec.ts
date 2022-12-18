import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentreportlandingComponent } from './parentreportlanding.component';

describe('ParentreportlandingComponent', () => {
  let component: ParentreportlandingComponent;
  let fixture: ComponentFixture<ParentreportlandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentreportlandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentreportlandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
