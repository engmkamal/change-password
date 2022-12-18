import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportparentComponent } from './supportparent.component';

describe('SupportparentComponent', () => {
  let component: SupportparentComponent;
  let fixture: ComponentFixture<SupportparentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportparentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportparentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
