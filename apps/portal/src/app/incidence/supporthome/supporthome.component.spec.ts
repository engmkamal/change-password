import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupporthomeComponent } from './supporthome.component';

describe('SupporthomeComponent', () => {
  let component: SupporthomeComponent;
  let fixture: ComponentFixture<SupporthomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupporthomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupporthomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
