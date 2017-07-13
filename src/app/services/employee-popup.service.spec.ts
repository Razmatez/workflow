import { TestBed, inject } from '@angular/core/testing';

import { EmployeePopupService } from './employee-popup.service';

describe('EmployeePopupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeePopupService]
    });
  });

  it('should be created', inject([EmployeePopupService], (service: EmployeePopupService) => {
    expect(service).toBeTruthy();
  }));
});
