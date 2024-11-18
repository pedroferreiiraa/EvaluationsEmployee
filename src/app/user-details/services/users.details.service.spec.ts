import { TestBed } from '@angular/core/testing';

import { UsersEvaluationsService } from './users.details.service';

describe('UsersEvaluationsService', () => {
  let service: UsersEvaluationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersEvaluationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
