import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputResultPatternComponent } from './input-result-pattern.component';

describe('InputResultPatternComponent', () => {
  let component: InputResultPatternComponent;
  let fixture: ComponentFixture<InputResultPatternComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputResultPatternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputResultPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
