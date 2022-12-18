import { TestBed } from '@angular/core/testing';

import { AppdataproviderService } from './appdataprovider.service';

describe('AppdataproviderService', () => {
  let service: AppdataproviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppdataproviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
