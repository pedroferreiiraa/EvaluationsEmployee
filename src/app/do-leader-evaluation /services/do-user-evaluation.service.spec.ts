import { TestBed } from '@angular/core/testing';

import { DoLeaderEvaluationService } from './do-leader-evaluation.service';

describe('DoUserEvaluationService', () => {
  let service: DoLeaderEvaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoLeaderEvaluationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
