import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonVisualizerComponent } from './json-visualizer.component';

describe('JsonVisualizerComponent', () => {
  let component: JsonVisualizerComponent;
  let fixture: ComponentFixture<JsonVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonVisualizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
