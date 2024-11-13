import { TestBed } from '@angular/core/testing';

import { DoUserEvaluationService } from './do-user-evaluation.service';

describe('DoUserEvaluationService', () => {
  let service: DoUserEvaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoUserEvaluationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
