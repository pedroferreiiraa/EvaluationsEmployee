import { TestBed } from '@angular/core/testing';

import { LeadersEvaluationsService } from './leaders.details.service';

describe('UsersEvaluationsService', () => {
  let service: LeadersEvaluationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadersEvaluationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
