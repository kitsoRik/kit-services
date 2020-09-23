import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPatternsComponent } from './input-patterns.component';

describe('InputPatternsComponent', () => {
  let component: InputPatternsComponent;
  let fixture: ComponentFixture<InputPatternsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputPatternsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
