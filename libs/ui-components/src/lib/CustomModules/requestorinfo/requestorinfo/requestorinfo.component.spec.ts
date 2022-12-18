import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestorinfoComponent } from './requestorinfo.component';

describe('RequestorinfoComponent', () => {
  let component: RequestorinfoComponent;
  let fixture: ComponentFixture<RequestorinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestorinfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestorinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
