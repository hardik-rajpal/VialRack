import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InPraiseOfMoviesPageComponent } from './in-praise-of-movies-page.component';

describe('InPraiseOfMoviesPageComponent', () => {
  let component: InPraiseOfMoviesPageComponent;
  let fixture: ComponentFixture<InPraiseOfMoviesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InPraiseOfMoviesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InPraiseOfMoviesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
