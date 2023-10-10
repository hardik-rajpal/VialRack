import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongboxComponent } from './songbox.component';

describe('SongboxComponent', () => {
  let component: SongboxComponent;
  let fixture: ComponentFixture<SongboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
