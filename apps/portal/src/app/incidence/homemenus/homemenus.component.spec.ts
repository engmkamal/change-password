import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomemenusComponent } from './homemenus.component';

describe('HomemenusComponent', () => {
  let component: HomemenusComponent;
  let fixture: ComponentFixture<HomemenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomemenusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomemenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
