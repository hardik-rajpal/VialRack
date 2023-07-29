import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InPraiseOfShowsPageComponent } from './in-praise-of-shows-page.component';

describe('InPraiseOfShowsPageComponent', () => {
  let component: InPraiseOfShowsPageComponent;
  let fixture: ComponentFixture<InPraiseOfShowsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InPraiseOfShowsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InPraiseOfShowsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
