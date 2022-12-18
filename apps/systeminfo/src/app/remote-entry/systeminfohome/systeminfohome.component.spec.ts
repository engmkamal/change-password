import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysteminfohomeComponent } from './systeminfohome.component';

describe('SysteminfohomeComponent', () => {
  let component: SysteminfohomeComponent;
  let fixture: ComponentFixture<SysteminfohomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SysteminfohomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SysteminfohomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
