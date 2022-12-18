import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterdetailsrendererComponent } from './masterdetailsrenderer.component';

describe('MasterdetailsrendererComponent', () => {
  let component: MasterdetailsrendererComponent;
  let fixture: ComponentFixture<MasterdetailsrendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterdetailsrendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterdetailsrendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
