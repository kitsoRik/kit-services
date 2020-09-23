import { TestBed } from '@angular/core/testing';

import { ResultControlerService } from './result-controler.service';

describe('ResultControlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResultControlerService = TestBed.get(ResultControlerService);
    expect(service).toBeTruthy();
  });
});
