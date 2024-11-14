import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoLeaderEvaluationComponent } from './do-leader-evaluation.component';

describe('DoLeaderEvaluationComponent', () => {
  let component: DoLeaderEvaluationComponent;
  let fixture: ComponentFixture<DoLeaderEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoLeaderEvaluationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoLeaderEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
