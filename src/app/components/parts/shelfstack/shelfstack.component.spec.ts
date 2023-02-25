import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfstackComponent } from './shelfstack.component';

describe('ShelfstackComponent', () => {
  let component: ShelfstackComponent;
  let fixture: ComponentFixture<ShelfstackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShelfstackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelfstackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
