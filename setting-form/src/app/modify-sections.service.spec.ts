import { TestBed } from '@angular/core/testing';

import { ModifySectionsService } from './modify-sections.service';

describe('ModifySectionsService', () => {
  let service: ModifySectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModifySectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
