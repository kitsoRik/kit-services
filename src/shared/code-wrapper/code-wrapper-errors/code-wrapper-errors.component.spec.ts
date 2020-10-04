import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeWrapperErrorsComponent } from './code-wrapper-errors.component';

describe('CodeWrapperErrorsComponent', () => {
  let component: CodeWrapperErrorsComponent;
  let fixture: ComponentFixture<CodeWrapperErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeWrapperErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeWrapperErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
