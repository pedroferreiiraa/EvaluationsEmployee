import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoUserEvaluationComponent } from './do-user-evaluation.component';

describe('DoUserEvaluationComponent', () => {
  let component: DoUserEvaluationComponent;
  let fixture: ComponentFixture<DoUserEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoUserEvaluationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoUserEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
