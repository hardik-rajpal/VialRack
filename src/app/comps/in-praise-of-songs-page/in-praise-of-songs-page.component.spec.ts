import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InPraiseOfSongsPageComponent } from './in-praise-of-songs-page.component';

describe('InPraiseOfSongsPageComponent', () => {
  let component: InPraiseOfSongsPageComponent;
  let fixture: ComponentFixture<InPraiseOfSongsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InPraiseOfSongsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InPraiseOfSongsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
