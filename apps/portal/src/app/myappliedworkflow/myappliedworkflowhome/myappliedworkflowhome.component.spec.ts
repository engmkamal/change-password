import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyappliedworkflowhomeComponent } from './myappliedworkflowhome.component';

describe('MyappliedworkflowhomeComponent', () => {
  let component: MyappliedworkflowhomeComponent;
  let fixture: ComponentFixture<MyappliedworkflowhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyappliedworkflowhomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyappliedworkflowhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
