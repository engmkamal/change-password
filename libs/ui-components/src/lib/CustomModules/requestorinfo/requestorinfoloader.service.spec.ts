import { TestBed } from '@angular/core/testing';

import { RequestorinfoloaderService } from './requestorinfoloader.service';

describe('RequestorinfoloaderService', () => {
  let service: RequestorinfoloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestorinfoloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
