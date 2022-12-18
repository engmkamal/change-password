import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTaskshomeComponent } from './pending-taskshome.component';

describe('PendingTaskshomeComponent', () => {
  let component: PendingTaskshomeComponent;
  let fixture: ComponentFixture<PendingTaskshomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingTaskshomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingTaskshomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
