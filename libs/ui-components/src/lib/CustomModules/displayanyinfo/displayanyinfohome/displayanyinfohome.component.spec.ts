import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayanyinfohomeComponent } from './displayanyinfohome.component';

describe('DisplayanyinfohomeComponent', () => {
  let component: DisplayanyinfohomeComponent;
  let fixture: ComponentFixture<DisplayanyinfohomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayanyinfohomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayanyinfohomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
