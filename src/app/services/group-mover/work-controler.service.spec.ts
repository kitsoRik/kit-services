import { TestBed } from '@angular/core/testing';

import { WorkControlerService } from './work-controler.service';

describe('WorkControlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkControlerService = TestBed.get(WorkControlerService);
    expect(service).toBeTruthy();
  });
});
