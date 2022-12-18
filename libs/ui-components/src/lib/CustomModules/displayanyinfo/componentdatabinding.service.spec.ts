import { TestBed } from '@angular/core/testing';

import { ComponentdatabindingService } from './componentdatabinding.service';

describe('ComponentdatabindingService', () => {
  let service: ComponentdatabindingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentdatabindingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
