import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMoverComponent } from './group-mover.component';

describe('GroupMoverComponent', () => {
  let component: GroupMoverComponent;
  let fixture: ComponentFixture<GroupMoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
