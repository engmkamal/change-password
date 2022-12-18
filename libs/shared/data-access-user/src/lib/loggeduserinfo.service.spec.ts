import { TestBed } from '@angular/core/testing';

import { LoggeduserinfoService } from './loggeduserinfo.service';

describe('LoggeduserinfoService', () => {
  let service: LoggeduserinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggeduserinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
