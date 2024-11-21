import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderDetailsComponent } from './leader-details.component';

describe('UserDetailsComponent', () => {
  let component: LeaderDetailsComponent;
  let fixture: ComponentFixture<LeaderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
