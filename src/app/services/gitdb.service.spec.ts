import { TestBed } from '@angular/core/testing';

import { GitdbService } from './gitdb.service';

describe('GitdbService', () => {
  let service: GitdbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GitdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
