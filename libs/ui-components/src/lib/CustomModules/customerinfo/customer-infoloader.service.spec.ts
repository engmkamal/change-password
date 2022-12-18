import { TestBed } from '@angular/core/testing';

import { CustomerInfoloaderService } from './customer-infoloader.service';

describe('CustomerInfoloaderService', () => {
  let service: CustomerInfoloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerInfoloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
