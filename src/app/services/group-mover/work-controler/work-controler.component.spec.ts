import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkControlerComponent } from './work-controler.component';

describe('WorkControlerComponent', () => {
  let component: WorkControlerComponent;
  let fixture: ComponentFixture<WorkControlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkControlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkControlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
