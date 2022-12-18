import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestorhomeComponent } from './requestorhome.component';

describe('RequestorhomeComponent', () => {
  let component: RequestorhomeComponent;
  let fixture: ComponentFixture<RequestorhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestorhomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestorhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
