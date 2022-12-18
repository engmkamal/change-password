import { TestBed } from '@angular/core/testing';

import { SupportapplicantloaderService } from './supportapplicantloader.service';

describe('SupportapplicantloaderService', () => {
  let service: SupportapplicantloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportapplicantloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
