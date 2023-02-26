import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImglinkComponent } from './imglink.component';

describe('ImglinkComponent', () => {
  let component: ImglinkComponent;
  let fixture: ComponentFixture<ImglinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImglinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImglinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
