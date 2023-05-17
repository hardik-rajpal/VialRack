import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtBoardComponent } from './thought-board.component';

describe('ThoughtBoardComponent', () => {
  let component: ThoughtBoardComponent;
  let fixture: ComponentFixture<ThoughtBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThoughtBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThoughtBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
