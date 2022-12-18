import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginparentComponent } from './loginparent.component';

describe('LoginparentComponent', () => {
  let component: LoginparentComponent;
  let fixture: ComponentFixture<LoginparentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginparentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginparentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
