import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InPraiseOfOthersPageComponent } from './in-praise-of-others-page.component';

describe('InPraiseOfOthersPageComponent', () => {
  let component: InPraiseOfOthersPageComponent;
  let fixture: ComponentFixture<InPraiseOfOthersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InPraiseOfOthersPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InPraiseOfOthersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
