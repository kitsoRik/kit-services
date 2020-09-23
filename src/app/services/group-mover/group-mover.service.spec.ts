import { TestBed } from '@angular/core/testing';

import { GroupMoverService } from './group-mover.service';

describe('GroupMoverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupMoverService = TestBed.get(GroupMoverService);
    expect(service).toBeTruthy();
  });
});
