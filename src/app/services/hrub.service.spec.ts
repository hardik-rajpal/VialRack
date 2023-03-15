import { TestBed } from '@angular/core/testing';

import { HrubService } from './hrub.service';

describe('HrubService', () => {
  let service: HrubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
